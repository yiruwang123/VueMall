<template>
    <div id="detail-swiper">
      <!--注意这里的swiper的class名字不能为swiper，编译的时候会出错-->
      <swiper class="dswiper">
        <swiper-item v-for="item in topImages">
          <img :src="item" alt="">
        </swiper-item>
      </swiper>
    </div>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

    export default {
      name: "DetailSwiper",
      components: {
        Swiper,
        SwiperItem
      },
      props: {
        topImages: {
          type: Array,
          default() {
            return []
          }
        }
      }
    }
</script>

<style scoped>

  .dswiper {
    height: 250px;
  }
</style>
