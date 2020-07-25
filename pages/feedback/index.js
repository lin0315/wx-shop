// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商品投诉',
        isActive: false
      }
    ],
  },

  handletabsItenChange(e) {
    // 获取被点击的索引
    const { index } = e.detail
    // 获取原数据 进行遍历
    let { tabs } = this.data
    tabs.forEach((n, i) => i === index ? n.isActive = true : n.isActive = false);
    // 赋值
    this.setData({
      tabs
    })
  },
})