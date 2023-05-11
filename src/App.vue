<script setup lang="ts">
import {RouterView} from 'vue-router'
</script>

<template>
    <div id="root">
        <RouterView/>
    </div>
</template>

<style>
/*需要把body，html标签和app容器的宽高都设为100%，否则应用内容可能占不满整个屏幕*/
html, body {
    width: 100%;
    height: 100%;
}

#root, #app {
    width: 100%;
    height: 100%;
}
</style>
