//utils为工具类，将一些常用功能的函数封装导出

//防抖函数,func传入的函数,delay等待的时间
export function debounce(func, delay = 50) {
  let timer = null

  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      //func()  也可以执行
      //console.log(this); this为undefined,如果设为null或undefined,则等同于指定全局对象,即谁的函数用谁的
      func.apply(this, args)
    }, delay)
  }
}

//函数运用了正则表达式
// + 表示一个或者多个
export function formatDate(date, fmt) {
  //获取年份
  // y+ ：1个或多个y
  // y* ：0个或多个y
  // y? ：0个或1个y
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

