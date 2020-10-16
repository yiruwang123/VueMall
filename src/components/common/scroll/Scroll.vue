<template>
  <div ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

	export default {
		name: "Scroll",
    props: {
		  probeType: {
		    type: Number,
        default: 1
      },
      data: {
		    type: Array,
        default: () => {
          return []
        }
      },
      pullUpLoad: {
		    type: Boolean,
        default: false
      }
    },
    data() {
		  return {
		    scroll: {}
      }
    },
    mounted() {
		  setTimeout(this.initScroll, 20)
    },
    methods: {
		  initScroll() {
		    // 1.初始化BScroll对象
		    if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: true,
          pullUpLoad: this.pullUpLoad
        })

        // 2.将监听事件回调
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })

        // 3.监听上拉到底部
        this.scroll.on('pullingUp', () => {
          // console.log('上拉加载');
          this.$emit('pullingUp')
        })
      },

      //刷新scroll的高度，解决高度bug
      refresh() {
		    //this.scroll.refresh始判断函数是否存在
        this.scroll && this.scroll.refresh && this.scroll.refresh()
      },

      //每一次上拉加载后都需要执行此方法后才可以再次上拉加载
      finishPullUp() {
		    this.scroll &&  this.scroll.finishPullUp()
      },
      scrollTo(x, y, time=300) {
		    //time就是整个过程的时间
        this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
        //this.scroll.scrollTo(x, y, time)
      },
      getScrollY() {
		    return this.scroll ? this.scroll.y : 0
      }
    },
    // watch: {
		//   data() {
    //     setTimeout(this.refresh, 20)
    //   }
    // }
	}
</script>

<style scoped>

</style>
