// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],
  },

  onShow() {
    // 获取收藏商品数组
    const collect = wx.getStorageSync('collect') || [];
    this.setData({
      collect
    })
  },

  handletabsItenChange(e) {
    // 1 获取被点击的索引
    const { index } = e.detail
    // 2 获取原数据 进行遍历 修改
    let { tabs } = this.data
    tabs.forEach((n, i) => i === index ? n.isActive = true : n.isActive = false);
    // 3 赋值
    this.setData({
      tabs
    })
  },
})