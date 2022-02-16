import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import * as echarts from 'echarts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'



const app = createApp(App);


// vue3 给原型上挂载属性
app.config.globalProperties.$echarts = echarts;
app.use(ElementPlus)
app.use(router).mount('#app')

