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
                <el-footer>Footer</el-footer>
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
    background-color: #9a9494;

    .el-aside {
      background-color: #545c64;
    }

    .el-container {
      .el-header {
        height: 80px;
        padding: 0;
      }

      .el-footer {
        background-color: #add6ea;
      }
    }
  }
}
</style>