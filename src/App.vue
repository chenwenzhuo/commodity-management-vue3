<script setup lang="ts">
import {RouterView} from 'vue-router'
</script>

<template>
    <RouterView/>
</template>

<style>
/*需要把body，html标签和app容器的宽高都设为100%，否则应用内容可能占不满整个屏幕*/
html, body {
    width: 100%;
    height: 100%;
}

#app {
    width: 100%;
    height: 100%;
}

.text-button {
    margin: 0;
    padding: 0;
    border: 0;
    background-color: rgba(255, 255, 255, 0);
    color: #1DA57A;
    cursor: pointer;
}
</style>
