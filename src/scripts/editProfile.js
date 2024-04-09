import { faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';

export default {
    components: {
        FontAwesomeIcon,
    },
    data() {
        return {
            username: '',
            name: '',
            email: '',
            role: '',
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
            this.name = this.$keycloak.tokenParsed.name;
            this.email = this.$keycloak.tokenParsed.email;
            this.role = this.determineUserRole(this.$keycloak.tokenParsed.resource_access['knowix_frontend']?.roles);
        },

        determineUserRole(roles) {
            if (roles?.includes('educator')) return 'Educador';
            if (roles?.includes('student')) return 'Estudiante';
            return 'Rol no encontrado';
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
                if (error.response && error.response.status === 204) {
                    await this.createDefaultSocialLinks(kcUserUuid);
                } else {
                    console.error("Error initializing social media links:", error);
                    Swal.fire('Error', 'No se pudieron inicializar los enlaces de redes sociales.', 'error');
                }
            }
        },

        async createDefaultSocialLinks(kcUserUuid) {
            try {
                for (let i = 0; i < 3; i++) {
                    const postData = {
                        kcUserUuid: kcUserUuid,
                        socialMediaUrl: "-",
                        status: true,
                    };
                    await axios.post('http://localhost:8081/api/v1/social-media', postData);
                }
                await this.initializeSocialLinks();
            } catch (error) {
                console.error('Error creating default social media links:', error);
                Swal.fire('Error', 'No se pudieron crear los enlaces de redes sociales por defecto.', 'error');
            }
        },

        toggleEdit() {
            this.editing = !this.editing;
        },

        async saveProfile() {
            for (const link of this.socialLinks) {
                if (!link.socialMediaId) {
                    console.warn('socialMediaId is undefined for a link, skipping PUT request', link);
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
            try {
                Swal.fire({
                    title: 'Guardando...',
                    html: 'Por favor, espera mientras se guarda tu perfil.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
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
                this.editing = false;
            } catch (error) {
                Swal.close();
                console.error('Error during profile save:', error);
                await Swal.fire('Error', 'Algo salió mal al guardar el perfil. ' + error.message, 'error');
            }
        },

        cancelEdit() {
            this.socialLinks = JSON.parse(JSON.stringify(this.originalSocialLinks));
            this.editing = false;
        }
    },
};