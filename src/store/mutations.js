const mutations = {
  //mutations唯一的目的就是修改state中状态
  //mutation中每个方法尽可能完成的事件单一一点
  addCounter(state, payload) {
    payload.count++
  },
  addToCart(state, payload) {
    state.cartList.push(payload)
  }
}

export default mutations

