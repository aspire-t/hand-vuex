import applyMixin from './mixin'
import { forEachValue } from './util'

export let Vue // 在整个项目中暴露出vue

// 容器的初始化
export class Store {
  // options 就是你new Vuex.Store({state,mutation,actions})
  constructor(options) {
    const state = options.state // 数据变化要更新视图 （vue的核心逻辑依赖收集）
    const computed = {}

    // 2. 处理getters属性，具有缓存的 computed 带有缓存 （多次取值是如果值不变是不会重新取值的）
    this.getters = {}
    forEachValue(options.getters, (fn, key) => {
      // 3. 计算属性的实现
      computed[key] = () => {
        return fn(this.state)
      }
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      })
    })

    // 1. 添加状态逻辑  数据在哪使用 就会收集对应的依赖
    this._vm = new Vue({
      data: {
        // 属性如果是通过$开头的，默认不会将这个属性挂载到vm上
        $$state: state, // 会将$$state  对应的对象，都通过defineProperty来进行属性劫持
      },
      computed,
    })
  }
  get state() {
    // 属性访问器   new Store().state  Object.defineProperty({get()})
    return this._vm._data.$$state
  }
}

// 插件的安装
// Vue.use 方法会调用插件的install方法，此方法中的参数就是Vue的构造函数
export const install = (_Vue) => {
  // _Vue 是Vue的构造函数
  Vue = _Vue
  // 需要将根组件中注入的store 分派给每一个组件 （子组件） Vue.mixin
  applyMixin(Vue)
}
