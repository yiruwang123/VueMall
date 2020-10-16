module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-px-to-viewport": {
      viewportWidth: 375,  //视图的宽度，对应的是我们设计稿的宽度 （设计稿一般是按照iphone6为原型）
      viewportHeigth: 667, //视图的高度，对应的是设计稿的高度（也可以不配置）
      //宽高不一样的话会等比例转化
      unitPrecision: 5,  //指定'px'转化为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw', //指定需要转化成的视图单位
      selectorBlackList: ['ignore','tab-bar','tab-bar-item'], //指定不需要转化的类,就是标签上的class
      minPixelValue: 1, //小于或等于'1px'不转化为视图单位
      mediaQuery: false //允许在媒体查询中转换'px'
    },
  }
}


//转化css的配置
