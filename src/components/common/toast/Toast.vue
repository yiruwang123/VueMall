<template>
  <div class="toast" v-show="show">
    <div>{{message}}</div>
  </div>
</template>

<script>
    export default {
      name: "Toast",
      props: {
        // message: {
        //   type: String,
        //   default: ''
        // },
        // show: {
        //   type: Boolean,
        //   default: false
        // }
      },
      data() {
        return{
          message: '',
          show: false
        }
      },
      methods: {
        showToast(message = "默认文字", duration = 2000) {
          this.show = true
          this.message = message

          setTimeout(() => {
            this.show = false
            this.message = ''
          }, duration)
        }
      }
    }
</script>

<style scoped>

  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    /* 在页面中居中显示*/
    transform: translate(-50%,-50%);
    padding: 8px 10px;

    color: white;
    background-color: rgba(0,0,0,.25);

    z-index: 999;
  }
</style>
