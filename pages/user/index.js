// pages/user/index.js
Page({
  data: {
    userinfo: {},
    collectNums: 0
  },

  onShow() {
    const userinfo = wx.getStorageSync('userinfo')
    // 获取收藏数组
    const collect = wx.getStorageSync('collect')
    this.setData({
      userinfo,
      collectNums: collect.length
    })
  }
})