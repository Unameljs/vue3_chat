import {createRouter,createWebHashHistory,RouteRecordRaw} from 'vue-router'
import chat from '../view/chat.vue'
import home from '../view/home.vue'

const routes:RouteRecordRaw[] = [
    {path:"/",component:home},
    {path:"/chat",component:chat},
]

const router = createRouter({
    history:createWebHashHistory(),
    routes
})

export default router