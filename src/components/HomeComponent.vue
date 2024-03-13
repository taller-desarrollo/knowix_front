<template>
    <div>
        <NavBarComponent />
        <div class="content">
            <h1>Home</h1>
        </div>
    </div>
</template>

<script>
import NavBarComponent from './NavBarComponent.vue';

export default {
    components: {
        NavBarComponent,
    },
};
</script>

<style scoped>
@import '../styles/ButtonsStyle.css';
@import '../styles/PageStyle.css';
</style>
