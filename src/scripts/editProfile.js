import { faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

axios.interceptors.response.use(response => {
    return response;
}, error => {
    console.log('Error response:', error.response);
});

export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            username: '',
            firstName: '',
            secondName: '',
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            roles: [],
            editing: false,
            originalSocialLinks: [],
            socialLinks: [],
        };
    },
    computed: {
        faUserIcon() {
            return faUser;
        },
    },
    async created() {
        if (this.$keycloak.authenticated) {
            this.setupUserProfile();
            await this.initializeSocialLinks();
        }
    },
    methods: {
        getSocialMediaIcon(url) {
            if (url.includes("facebook")) return require("@/assets/socialMedia/Facebook.png");
            if (url.includes("instagram")) return require("@/assets/socialMedia/Instagram.png");
            if (url.includes("linkedin")) return require("@/assets/socialMedia/Linkedin.png");
            if (url.includes("twitter")) return require("@/assets/socialMedia/Twitter.png");
            if (url.includes("youtube")) return require("@/assets/socialMedia/Youtube.png");
            if (url.includes("whatsapp")) return require("@/assets/socialMedia/Whatsapp.png");
            if (url.includes("telegram")) return require("@/assets/socialMedia/Telegram.png");
            if (url.includes("tiktok")) return require("@/assets/socialMedia/TikTok.png");
            if (url.includes("snapchat")) return require("@/assets/socialMedia/Snapchat.png");
            if (url.includes("github")) return require("@/assets/socialMedia/GitHub.png");
            return require("@/assets/socialMedia/General.png");
        },
        setupUserProfile() {
            this.username = this.$keycloak.tokenParsed.preferred_username;
            this.firstName = this.$keycloak.tokenParsed.given_name;
            this.secondName = this.$keycloak.tokenParsed.family_name;
            this.name = this.$keycloak.tokenParsed.name;
            this.email = this.$keycloak.tokenParsed.email;
            this.password = '';
            this.roles = this.$keycloak.tokenParsed.resource_access['knowix_frontend']?.roles;
        },
        determineUserRole(roles) {
            let role = '';
            if (roles?.includes('educator')) role += 'Educador';
            if (roles?.includes('student')) {
                if (role.length != 0) role += ' | ';
                role += 'Estudiante';
            }
            if(roles?.includes('administrator')) {
                if (role.length !== 0) role += ' | ';
                role += 'Administrador';
            }
            if (role.length === 0) return 'Rol no encontrado';
            return role;
        },
        async initializeSocialLinks() {
            const kcUserUuid = this.$keycloak.tokenParsed.sub;
            try {
                const response = await axios.get(`http://localhost:8081/api/v1/social-media/user/${kcUserUuid}`);
                if (response.status === 200 && response.data.length > 0) {
                    this.socialLinks = response.data.map((link) => ({
                        socialMediaId: link.socialMediaId,
                        url: link.socialMediaUrl,
                        status: link.status,
                    }));
                    this.originalSocialLinks = JSON.parse(JSON.stringify(this.socialLinks));
                } else {
                    await this.createDefaultSocialLinks(kcUserUuid);
                }
            } catch (error) {
                console.error("Error initializing social media links:", error);
            }
        },
        async createDefaultSocialLinks(kcUserUuid) {
            for (let i = 0; i < 3; i++) {
                const postData = {
                    kcUserUuid: kcUserUuid,
                    socialMediaUrl: "-",
                    status: true,
                };
                await axios.post('http://localhost:8081/api/v1/social-media', postData);
            }
            await this.initializeSocialLinks();
        },
        toggleEdit() {
            this.editing = !this.editing;
        },
        async saveProfile() {
            if (!this.firstName || !this.secondName || !this.email || (this.password && this.password !== this.confirmPassword)) {
                await Swal.fire({
                    icon: 'info',
                    title: 'Verifica los datos',
                    text: 'Por favor, asegúrate de que todos los campos están correctamente llenados y que las contraseñas coinciden.',
                });
                return;
            }

            for (const link of this.socialLinks) {
                if (!link.socialMediaId) {
                    console.warn('SocialMediaId is undefined for a link, skipping PUT request', link);
                    continue;
                }
                if (link.url.trim() === '') {
                    await Swal.fire({
                        icon: 'info',
                        title: 'Campo de URL vacío',
                        text: 'Si no tienes una red social, coloca "-" por favor.',
                    });
                    return;
                }
                const regex = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\/\w\-\.]*)*(\?\S*)?$/;
                if (link.url !== '-' && !regex.test(link.url)) {
                    await Swal.fire('Error', `La URL introducida no es válida: ${link.url}`, 'error');
                    return;
                }
            }

            Swal.fire({
                title: 'Guardando...',
                html: 'Por favor, espera mientras se guarda tu perfil y la configuración de redes sociales.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            try {
                const profileUpdatePayload = {
                    username: this.username,
                    firstName: this.firstName,
                    lastName: this.secondName,
                    email: this.email,
                    password: this.password,
                    roles: this.roles
                };
                await axios.put(`http://localhost:8081/api/v1/user`, profileUpdatePayload, {
                    headers: {
                        'X-UUID': this.$keycloak.tokenParsed.sub,
                    }
                });

                for (const link of this.socialLinks) {
                    const url = `http://localhost:8081/api/v1/social-media/${link.socialMediaId}`;
                    const payload = {
                        kcUserUuid: this.$keycloak.tokenParsed.sub,
                        socialMediaUrl: link.url,
                        status: link.url !== '-',
                    };
                    await axios.put(url, payload);
                }

                Swal.close();
                await Swal.fire('¡Éxito!', 'Tu perfil ha sido guardado correctamente.', 'success');
                this.name = `${this.firstName} ${this.secondName}`;
                window.location.reload();
                this.editing = false;
            } catch (error) {
                console.error('Error during profile save:', error);
                await Swal.fire('Error', 'Algo salió mal al guardar el perfil. ' + error.message, 'error');
                this.editing = false;
            }
        },
        cancelEdit() {
            this.setupUserProfile();
            this.socialLinks = JSON.parse(JSON.stringify(this.originalSocialLinks));
            this.editing = false;
        }
    },
};
