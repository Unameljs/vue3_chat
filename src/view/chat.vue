<template>
    <div style="width: 100vw;height: 100vh;background-color: rgb(236, 235, 235);overflow: hidden;">
        <div style="width: 100vw;overflow-y: scroll;height: 90vh;" ref="child">

            <div :style="user.itself ? 'display: flex;margin-top: 15px;flex-direction:row-reverse' : 'display: flex;margin-top: 15px;flex-direction:row'"
            v-for="(user,index) in messageData" :key="index">
                
                <div style="border-radius: 50%;width: 50px;height: 50px;margin-right: 5px;margin-left: 3px;">
                    <img style="width: 50px;height: 50px;" :src="user.avatar">
                </div>

                <div style="margin-bottom: 2vh;">
                    <div style="font-size: 12px;color: rgb(175, 177, 177);" :style="user.itself ? 'text-align:right' : 'text-align: left;'">{{ user.username }}</div>
                    <div
                        style="background-color:rgb(0, 153, 255);color: white;padding: 3px;max-width: 50vw;">
                        {{ user.text }}
                    </div>
                </div>

            </div>
        </div>

        <div style="position: fixed;bottom: 0;width:100vw;display: flex;align-items: center;background-color: rgb(228, 226, 226);justify-content: space-around;height: 10vh;overflow: hidden;">

            <div style="width: 75vw;padding-top: 1vh;padding-bottom: 1vh;">
                <van-field rows="1" style="overflow-y: scroll;max-height: 10vh;" autosize  type="textarea" @focus="onClick"  v-model="msg" />
            </div>

            <van-button :disabled="isDisabler" type="success" style="padding-top: 1vh;padding-bottom: 1vh;min-height: 4vh;" @click="sendMsg">发送</van-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {onUnmounted, reactive, ref,watch,nextTick } from 'vue'
import { io } from "socket.io-client";

const msg = ref('')
const isDisabler = ref(true)

const child = ref()

const socketID = ref('')

type messageDataType = {
    username:string,
    text:string,
    avatar:string,
    itself:boolean
}

const messageData:messageDataType[] = reactive([])

watch(msg,(n:string)=>{
    if(n){
        isDisabler.value = false
    }else{
        isDisabler.value = true
    }
})


watch(messageData, () => {
    nextTick(()=>{
        let scrollElem = child.value;
        scrollElem.scrollTo({ top: scrollElem.scrollHeight, behavior: 'smooth' });
    })
})

const socket = io('http://43.136.87.64:9000',{
    transports: ["websocket"]
});

socket.on('connect',()=>{
    console.log("连接成功");
    socketID.value = socket.id
})

const onClick = ()=>{
    console.log(132);
    
    let scrollElem = child.value;
    scrollElem.scrollTo({ top: scrollElem.scrollHeight, behavior: 'smooth' });
}

const sendMsg = ()=>{
    if(!msg.value) return
    let userInfo = JSON.parse(localStorage.getItem('userInfo')!)
    socket.emit("message",JSON.stringify({
        text:msg.value,
        avatar:userInfo.avatar,
        username:userInfo.username
    }))
    msg.value = ''
    isDisabler.value = true
}

socket.on("sendData",(message)=>{
    let data = JSON.parse(message.data)
    if(message.id == socketID.value){
        messageData.push({
            username:data.username,
            text:data.text,
            avatar:data.avatar,
            itself:true
        })
    }else{
        messageData.push({
            username:data.username,
            text:data.text,
            avatar:data.avatar,
            itself:false
        })
    }
})

onUnmounted(()=>{
    socket.disconnect()
})

</script>

<style></style>