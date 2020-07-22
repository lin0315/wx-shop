// pages/login/index.js
Page({
  // 点击登入事件
  handleGetUserInfo(e) {
    console.log(e);
    const { userInfo } = e.detail;
    wx.setStorageSync('userinfo', userInfo)
    wx.navigateBack({
      delta: 1
    })
  }
})