// pages/cart/index.js
// 1. 获取用户对小程序的获取地址授权
import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
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
    // 判断商品数组是否为空?
    allChecked = cart.length != 0 ? allChecked : false
    // 给data赋值
    this.setData({
      cart,
      allChecked,
      totaPrice,
      totaNum
    });
    wx.setStorageSync('cart', cart)
  },

  // 全选按钮事件
  handleAllChecked() {
    // 1 获取cart商品数组 和 allChecked 状态
    let { cart, allChecked } = this.data
    // 2 对allChecked状态进行取反
    allChecked = !allChecked;
    // 3 遍历cart 修改checked 让其跟全选状态一样
    cart.forEach(v => v.checked = allChecked)
    // 将数据保存在 data 和 本地缓存
    this.setCart(cart)
  },

  // 商品数量加减按钮 事件
  async handleItemNumEdit(e) {
    // 1. 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 2 获取商品数组 cart 
    let { cart } = this.data;
    // 3 根据id 获取商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "您是否要删除?" })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }

    } else {
      // 4 根据索引 修改数组中当前商品的数量
      cart[index].num += operation;
      // 5 重新设置回 data 和 本地缓存
      this.setCart(cart)
    }
  },

  // 点击 结算 按钮事件
  async handlePay() {
    // 1 获取收获信息 和 结算数量
    const { address, totaNum } = this.data;
    // 2 判断是否有地址信息
    if (!address.userName) {
      await showToast({ title: '请先获取收获地址' })
      return;
    }
    // 3 判断是否有选中商品
    if (totaNum === 0) {
      await showToast({ title: '请选择要购买的商品' })
      return;
    }
    // 4 跳转到支付页面 
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})