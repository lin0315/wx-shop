// pages/cart/index.js
// 1. 获取用户对小程序的获取地址授权
import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}
  },

  onShow() {
    // 获取获取本地存储中的地址信息
    const address = wx.getStorageSync('address')
    // 给data赋值
    this.setData({
      address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击获取收货地址事件
  async handleChooseAddress() {
    try {
      // 1. 获取用户权限
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting['scope.address'];
      // 判断当前权限
      if (scopeAddress === false) {
        // 诱导用户打开权限
        await openSetting();
      }
      // 调用获取地址信息
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 存入本地存储
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error);
    }
  }
})