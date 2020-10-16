const getters = {
  cartList(state) {
    return state.cartList
  },
  cartLength(state, getters) {
    return getters.cartList.length
  }
}

export default getters
