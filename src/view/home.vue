<template>
    <div style="height: 100vh;background-color: bisque;">
        <div style="display: flex;align-items: center;justify-content: center;height: 40vh;">
            <van-image round width="10rem" height="10rem" :src="avatar ? avatar : arr[2]" />
        </div>

        <div style="display: flex;justify-content: center;">
            <van-field style="width: 80vw;" input-align="center" :maxlength="8" @update:model-value="onchange"
                v-model="username" placeholder="请输入昵称" />
        </div>

        <div style="display: flex;justify-content: center;font-size: 2rem;margin-top: 2vh;color: rosybrown;">
            请选择你的英雄!
        </div>

        <div style="margin-top: 3vh;display: flex;flex-wrap: wrap;justify-content: space-around;align-items:center">
            <van-image style="padding-top: 1vh;" v-for="(img, index) in arr" :key="index" round width="5rem" height="5rem" :src="img" @click="avatarChange(img)" />
        </div>

        <van-button :disabled="isDisabled" style="margin-top: 2vh;width: 80vw;margin-left: 10vw;" type="primary" @click="gotoChat" block>加入聊天室</van-button>

    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { showToast } from 'vant';
import 'vant/es/toast/style';
import { watch } from 'vue';

const imageList: Record<string, { default: string }> = import.meta.glob('../assets/*.*', { eager: true })
let arr = Object.values(imageList).map(v => v.default)

const router = useRouter()

const username = ref('')
const avatar = ref('')
const isDisabled = ref(true)

try {
    let userInfo = JSON.parse(localStorage.getItem('userInfo')!)
    username.value = userInfo.username
    avatar.value = userInfo.avatar
    isDisabled.value = false
} catch (error) {   
}


const onchange = (str: string) => {
    if (str.length >= 8) {
        showToast("昵称最多八位")
    }
}

watch(username,(n:string)=>{
    if(n){
        isDisabled.value = false
    }else{
        isDisabled.value = true
    }
})

const avatarChange = (str: string) => {
    avatar.value = str
}

const gotoChat = () => {
    localStorage.setItem('userInfo',JSON.stringify({
        username:username.value,
        avatar:avatar.value
    }))
    router.push('/chat')
}
</script>

<style></style>