<template>
  <div class="cart-list">
    <!--scroll的必须有确定的高度，父组件也要是100vh-->
    <scroll class="content" ref="scroll">

      <cart-list-item v-for="(item,index) in cartList" :key="index" :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  import {mapGetters} from 'vuex'

    export default {
      name: "CartList",
      components: {
        CartListItem,
        Scroll
      },
      computed: {
        ...mapGetters([
          'cartList'
        ])
      },
      activated() {
        this.$refs.scroll.refresh()
      }
    }
</script>

<style scoped>
  .cart-list {
    /*height: 100vh;*/
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>
