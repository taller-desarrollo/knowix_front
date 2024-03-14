<template>
    <div>
        <div class="navbar">
            <button class="general" @click="routes('/home')">Log In</button>
        </div>
        <div class="content">
            <h1>Log In</h1>
        </div>
    </div>
</template>

<script>
import { route } from '../scripts/route.js';

export default {
    methods: {
        routes(path) {
            route(this, path);
        },
    },
};
</script>
