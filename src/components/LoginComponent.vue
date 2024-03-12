<template>
    <div>
        <div class="navbar">
            <button class="general" @click="login">Log In</button>
        </div>
        <h1>Login</h1>
    </div>
</template>

<script>
export default {
    name: 'LoginComponent',
    methods: {
        login() {
            this.$router.go(-1);
            this.$router.replace('/home');
        },
    },
};
</script>

