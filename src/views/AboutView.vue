<template>
    <div class="about">
        <h1>This is an about page</h1>
        <el-button type="primary">button</el-button>
    </div>
</template>

<script setup lang="ts">
import {ElButton} from "element-plus";
</script>
<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
