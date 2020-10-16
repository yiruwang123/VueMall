<template>
  <div>
    <swiper>
      <swiper-item v-for="item in banners">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imgLoad">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

    export default {
      name: "HomeSwiper",
      props: {
        banners: {
          type: Array,
          default() {
            return []
          }
        }
      },
      data() {
        return{
          isLoad: false
        }
      },
      components: {
        Swiper,
        SwiperItem
      },
      methods: {
        imgLoad() {
          if (!this.isLoad){
            //发一次就行了
            this.$emit('swiperImageLoad')
            this.isLoad = true
          }
        }
      }
    }
</script>

<style scoped>

</style>
