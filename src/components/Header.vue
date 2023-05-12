<template>
    <div class="header-container">
        <div class="header-upper">
            <span>欢迎，{{ curUserStore.curUser.username }}</span>
            <el-popconfirm
                    width="200"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    confirm-button-type="success"
                    title="是否确认退出登陆？"
                    :icon="QuestionFilled"
                    @confirm="logout"
            >
                <template #reference>
                    <button class="text-button">退出登陆</button>
                </template>
            </el-popconfirm>
        </div>
        <div class="header-lower">
            <span class="menu-name">{{ curMenuStore.curMenuName }}</span>
            <span class="time">{{ curTime }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";
import {QuestionFilled} from "@element-plus/icons-vue";
import {useCurrentUserStore} from "@/stores/CurrentUser";
import {useCurMenuStore} from "@/stores/CurrentMenu";
import {timeFormatter} from "@/utils/tools";
import router from "@/router";

const curUserStore = useCurrentUserStore();
const curMenuStore = useCurMenuStore();
const curTime = ref('');
let timer;

function logout(): void {
    //清除用户数据
    curUserStore.$patch({
        curUser: {
            _id: '',
            username: '',
            phone: '',
            email: '',
            create_time: 0,
            role_id: '',
        }
    });
    curMenuStore.setCurMenuName('');//清楚菜单数据
    router.replace('/login');//跳转登陆界面
}

onMounted(() => {//组件挂载时开启定时器更新时间
    timer = setInterval(() => {
        curTime.value = timeFormatter(Date.now());
    }, 1000);
});

onBeforeUnmount(() => {//组件卸载前关闭定时器
    clearInterval(timer);
});
</script>

<style scoped lang="less">
.header-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  .header-upper {
    height: 50%;
    box-sizing: border-box;
    border-bottom: 1px solid #1DA57A;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      font-size: 18px;
    }

    button {
      margin: 0 30px;
      font-size: 16px;
    }
  }

  .header-lower {
    height: 50%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu-name {
      margin-left: 15%;
      font-size: 25px;
      position: relative;

      &::after {
        content: '';
        border: 20px solid rgba(255, 255, 255, 0);
        border-top-color: #ffffff;
        position: absolute;
        top: 125%;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .time {
      margin-right: 30px;
    }
  }
}
</style>