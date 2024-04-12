import { faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

axios.interceptors.response.use(response => {
    return response;
}, error => {
    Swal.fire('Error', error.response?.data?.message || 'Un error ha ocurrido', 'error');
    throw error;
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
            if (url.includes("facebook")) return require("@/assets/Facebook.png");
            if (url.includes("instagram")) return require("@/assets/Instagram.png");
            if (url.includes("linkedin")) return require("@/assets/Linkedin.png");
            if (url.includes("twitter")) return require("@/assets/Twitter.png");
            if (url.includes("x")) return require("@/assets/Twitter.png");
            if (url.includes("youtube")) return require("@/assets/Youtube.png");
            if (url.includes("whatsapp")) return require("@/assets/Whatsapp.png");
            if (url.includes("telegram")) return require("@/assets/Telegram.png");
            if (url.includes("tiktok")) return require("@/assets/TikTok.png");
            if (url.includes("snapchat")) return require("@/assets/Snapchat.png");
            if (url.includes("github")) return require("@/assets/GitHub.png");
            return require("@/assets/General.png");
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
            if (!this.firstName || !this.secondName || !this.email) {
                await Swal.fire({
                    icon: 'warning',
                    title: 'Campos obligatorios',
                    text: 'Todos los campos principales deben ser llenados para continuar.',
                });
                return;
            }

            const profileUpdatePayload = {
                username: this.username,
                firstName: this.firstName,
                lastName: this.secondName,
                email: this.email,
                roles: this.roles
            };

            if (this.password && this.password === this.confirmPassword) {
                profileUpdatePayload.password = this.password;
            } else if (this.password !== this.confirmPassword) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error en la contraseña',
                    text: 'Las contraseñas no coinciden.',
                });
                return;
            }

            try {
                const response = await axios.put(`http://localhost:8081/api/v1/user`, profileUpdatePayload, {
                    headers: {
                        'X-UUID': this.$keycloak.tokenParsed.sub,
                    }
                });

                if (response.status === 200) {
                    this.name = `${this.firstName} ${this.secondName}`;
                    window.location.reload();
                }
                Swal.fire('¡Éxito!', 'Tu perfil ha sido guardado correctamente.', 'success');
                this.editing = false;
            } catch (error) {
                console.error('Error during profile save:', error);
                await Swal.fire('Error', 'Algo salió mal al guardar el perfil.', 'error');
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
