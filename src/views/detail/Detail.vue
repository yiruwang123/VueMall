<template>
    <div id="detail">
      <!--这里的detail-nav-bar不用定位，因为scroll是局部滚动-->
      <detail-nav-bar class="detail-nav" :probe-type="3" @titleClick="titleClick" ref="nav"></detail-nav-bar>
      <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
        <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
        <goods-list :goods="recommends" ref="recommend"></goods-list>
      </scroll>
      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>

      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail"
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from "common/mixin"

  import {mapActions} from "vuex"

  export default {
      name: "Detail",
      components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        DetailBottomBar,
        Scroll,
        GoodsList
      },
      mixins: [itemListenerMixin, backTopMixin],
      data() {
        return {
          iid: null,
          topImages: [],
          goods: {},
          shop: {},
          detailInfo: {},
          paramInfo: {},
          commentInfo: {},
          recommends: [],
          themeTopYs: [],
          getThemeTopY: null,
          currentIndex:0
        }
      },
      //如果有keep-alive，created只执行一次，不会被销毁，所以数据也会只获取一次
      //要把本网页从keep-alive中去除
      created() {
        // id为动态路由中从参数名
        this.iid = this.$route.params.id

        //根据id请求数据详情
        getDetail(this.iid).then(res => {
          const data = res.result
          //1.获取顶部轮播图数据
          this.topImages = data.itemInfo.topImages

          //2.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

          //3.获取店铺信息
          this.shop = new Shop(data.shopInfo)

          //4.保存商品详情数据
          this.detailInfo = data.detailInfo

          //5.获取商品参数信息
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

          //6.获取评论信息,有的商品可能没有评论
          if(data.rate.cRate !== 0){
            this.commentInfo = data.rate.list[0]
          }
        })

        //请求推荐数据
        getRecommend().then(res => {
          this.recommends = res.data.list
        })

        //给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
        this.getThemeTopY = debounce(() => {
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.param.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          this.themeTopYs.push(Number.MAX_VALUE)
        }, 100)
      },
      mounted() {
        //混入部分有代码执行
      },
      destroyed() {
        //注意这里不能写在deactivated里面，因为<keep-alive exclude="Detail">，
        //detail页面没有缓存，而deactivated需要配合keep-alive使用
        this.$bus.$off("itemImgLoad",this.itemImgListenser)
      },
      methods: {
        ...mapActions(['addCart']),
        imgLoad() {
          this.$refs.scroll.refresh()
          this.getThemeTopY()
          //console.log(this.themeTopYs);
        },
        titleClick(index) {
          this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
          this.currentIndex = index
        },
        contentScroll(pos) {
          //获取y值
          const posY = -pos.y

          //进行比较  this.currentIndex !== i 减少语句执行次数
          for (let i = 0; i < this.themeTopYs.length - 1; i++) {
            if (this.currentIndex !== i && (posY >= this.themeTopYs[i] && posY < this.themeTopYs[i+1])) {
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
            }
          }

          this.listenShowBackTop(pos)
        },
        addToCart() {
          //1.获取购物车需要展示的信息
          const product = {}
          product.image = this.topImages[0]
          product.title = this.goods.title
          product.desc = this.goods.desc
          product.price = this.goods.nowPrice
          product.iid = this.iid

          //2.将商品添加到购物车，使用vuex
          // this.$store.dispatch('addCart', product).then(res => {
          //   console.log(res);
          // })
          this.addCart(product).then(res => {
            // console.log(res);
            this.$toast.showToast(res, 2000)
          })
        }
      }
    }
</script>

<style scoped>

  #detail {
    /*隐藏下面的maintabbar*/
    position: relative;
    z-index: 9;
    background-color: #fff;
    /*height: 100vh;这个是配合下面定位使用的，父组件的高度要等于视图高度*/
    height: 100vh;
  }

  .detail-nav {
    /*显示在上面*/
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /*也可以绝对定位，100%为父组件高度 */
    /*height: calc(100% - 44px);*/
    position: absolute;
    top: 44px;
    bottom: 52px;
    left: 0;
    right: 0;
  }
</style>
