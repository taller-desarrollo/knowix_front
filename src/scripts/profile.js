import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { makeFieldsEditable } from '../scripts/editProfile.js';

library.add(faUser);

export default {
    components: {
        FontAwesomeIcon
    },
    data() {
        return {
            username: '',
            name: '',
            email: '',
            role: '',
            socialLinks: JSON.parse(localStorage.getItem('socialLinks')) || {
                facebook: '#',
                twitter: '#',
                instagram: '#',
            },
        };
    },
    methods: {
        updateLinks(newLinks) {
            this.socialLinks = { ...this.socialLinks, ...newLinks };
            this.$forceUpdate();
        },
    },
    async created() {
        if (this.$keycloak.authenticated) {
            this.username = this.$keycloak.tokenParsed.preferred_username;
            this.name = this.$keycloak.tokenParsed.name;
            this.email = this.$keycloak.tokenParsed.email;
            const clientRoles = this.$keycloak.tokenParsed.resource_access['knowix_frontend']?.roles;
            if (clientRoles && clientRoles.includes('educator')) {
                this.role = 'Educador';
            } else if (clientRoles && clientRoles.includes('student')) {
                this.role = 'Estudiante';
            } else {
                this.role = 'Rol no encontrado';
            }
        }
    },
    mounted() {
        makeFieldsEditable(this.updateLinks, this.socialLinks);
    }
};