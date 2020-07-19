// pages/cart/index.js
// 1. 获取用户对小程序的获取地址授权
import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totaPrice: 0,
    totaNum: 0
  },

  onShow() {
    // 获取获取本地存储中的地址信息
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    this.setData({ address })
    this.setCart(cart)
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
  },

  // 商品的选中
  handleItemChange(e) {
    //1 获取被修改商品的id
    const goods_id = e.currentTarget.dataset.id
    //2 获取购物车数组
    let cart = this.data.cart
    // 3 根据id拿索引
    const index = cart.findIndex(v => v.goods_id === goods_id)
    // 4 根据索引拿商品将checked 取反
    cart[index].checked = !cart[index].checked
    // 5. 重新把数据设置会data 和 本地存储
    this.setCart(cart)
  },

  // 设置购物车状态同时 进行重新计算价格等数据
  setCart(cart) {

    // 计算总价格和总数量
    let totaPrice = 0;
    let totaNum = 0;
    let allChecked = true
    cart.forEach(v => {
      if (v.checked) {
        totaPrice += v.goods_price * v.num;
        totaNum++
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length != 0 ? allChecked : false
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totaPrice,
      totaNum
    });
    wx.setStorageSync('cart', cart)
  }
})