// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime'
import { request } from '../../request/index.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totaPrice: 0,
    totaNum: 0
  },

  onShow() {
    // 获取获取本地存储中的地址信息
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({ address })
    // 计算总价格和总数量
    let totaPrice = 0;
    let totaNum = 0;
    cart.forEach(v => {
      totaPrice += v.goods_price * v.num;
      totaNum++
    })
    // 给data赋值
    this.setData({
      cart,
      totaPrice,
      totaNum,
      address
    });
  },

  // 点击 支付 
  async handleOrderPay() {
    try {

      // 1 判断缓存中有没有loginParams 代替 token 
      const loginParams = wx.getStorageSync("loginParams");
      // 2 判断
      if (!loginParams) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }

      // 3 将要支付的商品添加到缓存中 手动删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      //  将要支付购买的商品添加到 订单数组
      let orders = wx.getStorageSync("orders");
      let newOrders = newCart.filter(v => v.checked)
      // 将购买的商品从购物车数组中删除
      newCart = newCart.filter(v => !v.checked);

      const d = new Date()
      newOrders.forEach(v => {
        v.create_time = d.getTime()
      })

      // 更新缓存
      wx.setStorageSync("cart", newCart);
      wx.setStorageSync("orders", [...orders, ...newOrders]);

      // 4 支付成功了 跳转到订单页面
      wx.showLoading({
        title: '支付中',
        mask: true
      })

      setTimeout(function () {
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/order/index?type=1'
        });
      }, 700)




    } catch (error) {
      await showToast({ title: "支付失败" })
      console.log(error);
    }
  }

  // 该账号非企业账号 不能实现支付 故将该流程注释 采用其它方式模拟
  // 点击 支付 
  // async handleOrderPay() {
  //   try {

  //     // 1 判断缓存中有没有token 
  //     const token = wx.getStorageSync("token");
  //     // 2 判断
  //     if (!token) {
  //       wx.navigateTo({
  //         url: '/pages/auth/index'
  //       });
  //       return;
  //     }
  //     // 3 创建订单
  //     // 3.1 准备 请求头参数
  //     // const header = { Authorization: token };
  //     // 3.2 准备 请求体参数
  //     const order_price = this.data.totalPrice;
  //     const consignee_addr = this.data.address.all;
  //     const cart = this.data.cart;
  //     let goods = [];
  //     cart.forEach(v => goods.push({
  //       goods_id: v.goods_id,
  //       goods_number: v.num,
  //       goods_price: v.goods_price
  //     }))
  //     const orderParams = { order_price, consignee_addr, goods };
  //     // 4 准备发送请求 创建订单 获取订单编号
  //     const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
  //     // 5 发起 预支付接口
  //     const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
  //     // 6 发起微信支付 
  //     await requestPayment(pay);
  //     // 7 查询后台 订单状态
  //     const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
  //     await showToast({ title: "支付成功" });
  //     // 8 手动删除缓存中 已经支付了的商品
  //     let newCart = wx.getStorageSync("cart");
  //     newCart = newCart.filter(v => !v.checked);
  //     wx.setStorageSync("cart", newCart);

  //     // 8 支付成功了 跳转到订单页面
  //     wx.navigateTo({
  //       url: '/pages/order/index'
  //     });

  //   } catch (error) {
  //     await showToast({ title: "支付失败" })
  //     console.log(error);
  //   }
  // }
})
