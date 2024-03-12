<template>
    <div>
        <div class="navbar">
            <button class="cancel" @click="logout">Log Out</button>
        </div>
        <h1>Home</h1>
    </div>
</template>

<script>

export default {
    name: 'NavBarComponent',
    methods: {
        logout() {
            this.$router.go(-1);
            this.$router.replace('/');
        },
    },
};
</script>

<style scoped>
@import '../styles/ButtonsStyle.css';
@import '../styles/PageStyle.css';
</style>