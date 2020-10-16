<template>
    <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

      <tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"
                   ref="tabControl1" v-show="isTabFixed"></tab-control>
      <!--probe-type前面如果没有：,传的将是字符串3-->
      <!--ref获取组件对象-->
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
        @pullingUp="loadMore">
        <home-swiper :banners = "banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
        <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
        <tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"
          ref="tabControl2" ></tab-control>
        <goods-list :goods="showGoods"></goods-list>
      </scroll>

      <!-- 监听组件点击要加.native,如果是监听一个标签的化就直接@click, 也可以直接监听图片点击 -->
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    </div>
</template>

<script>
  //别名在vue.config.js里配置
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'

  //导入的函数不用this.函数 来进行调用，直接用
  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from 'common/utils'
  import {itemListenerMixin, backTopMixin} from "common/mixin"

  export default {
      name: "Home",
      components: {
        HomeSwiper,
        RecommendView,
        FeatureView,
        NavBar,
        TabControl,
        GoodsList,
        Scroll
      },
      mixins: [itemListenerMixin, backTopMixin],
      data() {
        return {
          banners: [],
          recommends: [],
          goods: {
            'pop': {page: 0, list:[]},
            'new': {page: 0, list:[]},
            'sell': {page: 0, list:[]}
          },
          currentType: 'pop',
          isShowBackTop: false,
          tabOffsetTop: 0,
          isTabFixed: false,
          saveY: 0
        }
      },
      computed: {
        showGoods() {
          return this.goods[this.currentType].list
        }
      },
      activated() {  //进入页面执行
        //进入页面先刷新，防止超出高度
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollTo(0,this.saveY,0)
      },
      deactivated() {  //离开页面执行
        //1.保存Y值
        this.saveY = this.$refs.scroll.getScrollY()

        //2.取消全局事件的监听
        this.$bus.$off("itemImgLoad",this.itemImgListenser)
      },
      created() {
        //1.请求多个数据,这里是用的自己定义的，要加this
        this.getHomeMultidata()

        //2.请求商品数据
        this.getHomeGoods('pop')
        this.getHomeGoods('new')
        this.getHomeGoods('sell')

      },
      mounted() {
        //1.本部分代码混入执行,监听GoodsListItem组件发出的事件,这个不要写在created里面
        //这里要用箭头函数，不然this的指向错误,要使用外层的this
        //可以使用防抖函数解决执行频率过高的问题
        // this.$bus.$on('itemImgLoad', () => {
        //   this.$refs.scroll.refresh()
        // })

        //防抖重写,debounce函数在utils里面
        // const refresh = debounce(this.$refs.scroll.refresh, 200)

        //对监听事件保存,箭头函数可以赋值写法，这样写的跟普通函数差不多
        // this.itemImgListenser =  () => {
        //   refresh()
        // }
        //this.$bus.$on('itemImgLoad', itemImgListenser)

        //2.获取tabControl的offsetTop,offsetTop是元素的属性,不是组件的属性,refs获取的是组件对象
        //所有的组件都有一个属性$el，获取组件中的元素(应该是最外面的)
        //mounted中图片可能没有加载完,必须等到图片全部加载完后才能获取到正确的值
        //这里直接在HomeSwiper中监听轮播图的加载，因为轮播图加载最慢，小的图片加载快影响不大
        //swiperImageLoad()
      },
      methods: {
        //事件监听相关
        tabClick(index) {
          switch (index) {
            case 0:
              this.currentType = 'pop'
              break
            case 1:
              this.currentType = 'new'
              break
            case 2:
              this.currentType = 'sell'
              break
          }
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        },
        contentScroll(position) {
          //1.判断backtop是否显示
          this.listenShowBackTop(position)

          //2.决定tabControl是否吸顶（position：fixed）
          this.isTabFixed = (-position.y) > this.tabOffsetTop
        },
        loadMore() {
          this.getHomeGoods(this.currentType)
        },
        swiperImageLoad() {
          this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        },

        //网路请求相关
        getHomeMultidata() {
          getHomeMultidata().then(res=> {
            this.banners = res.data.banner.list
            this.recommends = res.data.recommend.list
          })
        },
        getHomeGoods(type) {
          const page = this.goods[type].page + 1
          getHomeGoods(type, page).then(res => {
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page += 1

            //完成上拉加载更多
            this.$refs.scroll.finishPullUp()
          })
        }
      }
    }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    /*position: relative;*/
  }

  .home-nav {
    background-color: var(--color-tint);
    color:white;

    /*在使用浏览器原生滚动时，为了让导航不随网页一起滚动设置下面属性
    但是现在使用了betterscroll设置了滚动的区域，所以不需要了 */
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    /*overflow: hidden;*/
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
