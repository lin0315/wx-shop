// pages/search/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 按钮是否隐藏
    isFocus: false,
    // 输入框的值
    inpValue: ""
  },
  TimeId: -1,

  // 监听输入框事件
  handleInput(e) {
    const { value } = e.detail
    // 判断是否为空格
    if (!value.trim()) {
      // 不合理
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    // 发送请求
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 800)
  },
  // 请求数据
  async qsearch(query) {
    const res = await request({ url: '/goods/search', data: { query } })
    this.setData({
      goods: res.goods
    })
  },
  handleCancel() {
    this.setData({
      inpValue: "",
      goods: [],
      isFocus: false
    })
  }
})