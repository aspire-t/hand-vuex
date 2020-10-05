export default function applyMixin(Vue) {
  Vue.mixin({
    beforeCreate: vuexInit,
  })
}

// 组件渲染时从父=》子
function vuexInit() {
  // 给所有的组件增加$store 属性 指向我们创建的store实例
  const options = this.$options // 获取用户所有的选项
  if (options.store) {
    // 根实例
    this.$store = options.store
  } else if (options.parent && options.parent.$store) {
    // 儿子 或者孙子....
    this.$store = options.parent.$store
  }
}
