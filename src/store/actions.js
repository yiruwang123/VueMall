const actions = {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1.查看是否添加过,find是数组函数，类似于map、filter等
      const oldInfo = context.state.cartList.find(item => item.iid === payload.iid)

      // let oldInfo = null
      // for(let item of state.cartList) {
      //   if(irem.iid === info.iid) {
      //     oldInfo = item
      //   }
      // }

      // 2.+1或者新添加
      if (oldInfo) {
        context.commit('addCounter', oldInfo)
        resolve("当前商品数量+1")
      } else {
        payload.count = 1
        payload.checked = true
        context.commit('addToCart', payload)
        resolve("添加商品成功")
      }
    })
  }
}

export default actions

