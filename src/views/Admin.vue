<template>
    <div class="outer-wrapper">
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>Main</el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.outer-wrapper {
  height: 100%;

  .el-container {
    height: 100%;
    background-color: #9a9494;

    .el-aside {
      background-color: #dedcdc;
    }

    .el-container {
      .el-header {
        height: 80px;
        background-color: #add6ea;
      }

      .el-footer {
        background-color: #add6ea;
      }
    }
  }
}
</style>