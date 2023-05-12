<template>
    <div class="outer-wrapper">
        <el-container>
            <el-aside>
                <AsideNav/>
            </el-aside>
            <el-container>
                <el-header>
                    <Header/>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
                <el-footer>推荐使用谷歌浏览器，可获得更佳浏览体验</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import AsideNav from "@/components/AsideNav.vue";
import Header from "@/components/Header.vue";
</script>

<style scoped lang="less">
.outer-wrapper {
  height: 100%;

  .el-container {
    height: 100%;
    background-color: #e8e8e8;

    .el-aside {
      background-color: #081524;
    }

    .el-container {
      .el-header {
        height: 80px;
        padding: 0;
      }

      .el-main {
        margin: 24px;
        background-color: #ffffff;
      }

      .el-footer {
        color: #939393;
        background-color: #cecece;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
    }
  }
}
</style>