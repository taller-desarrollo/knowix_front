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
            try {
                Swal.showLoading();
                for (const link of this.socialLinks) {
                    if (!link.socialMediaId) {
                        console.warn('socialMediaId is undefined for a link, skipping PUT request', link);
                        continue;
                    }
                    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                    if (link.url !== '-' && !regex.test(link.url)) {
                        throw new Error(`La URL introducida no es válida: ${link.url}`);
                    }
                    const url = `http://localhost:8081/api/v1/social-media/${link.socialMediaId}`;
                    console.log('Making PUT request to:', url);
                    const payload = {
                        kcUserUuid: this.$keycloak.tokenParsed.sub,
                        socialMediaUrl: link.url,
                        status: link.url !== '-',
                    };
                    await axios.put(url, payload);
                }
                Swal.close();
                this.editing = false;
            } catch (error) {
                console.error('Error during profile save:', error);
                Swal.fire('Oops...', 'Algo salió mal al guardar el perfil. ' + error.message, 'error');
            }
        },
        cancelEdit() {
            this.socialLinks = JSON.parse(JSON.stringify(this.originalSocialLinks));
            this.editing = false;
        }
    },
};
