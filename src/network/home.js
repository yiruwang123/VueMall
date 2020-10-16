import axios from './axios'

export const BANNER = 'banner'
export const RECOMMEND = 'recommend'

export function getHomeMultidata() {
  return axios({
    url: '/home/multidata'
  })
}

//params就是url后面跟   /?a=a&b=b
export function getHomeGoods(type, page) {
  return axios({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}
