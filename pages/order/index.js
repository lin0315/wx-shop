// pages/order/index.js

import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
    orders: []
  },

  onShow() {
    // 1 判断缓存中有没有loginParams 代替 token 
    const loginParams = wx.getStorageSync("loginParams");
    // 2 判断
    if (!loginParams) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }

    // 1. 获取小程序的页面数组
    let pages = getCurrentPages()
    // 2 最大索引就是当前页面
    let type = pages[pages.length - 1].options.type
    // 激活选中页面标题 type=1 index=0
    this.changTitleByIndex(type - 1)
    // this.getOrders(type)

    // 1. 获取订单数组
    let orders = wx.getStorageSync('orders') || [];
    orders.forEach(v => v.order_number = 'HMDD2020072300000000' + Math.floor((Math.random() * 9999)));
    this.setData({
      orders: orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time).toLocaleString()) })).reverse()
    })

  },

  changTitleByIndex(index) {
    // 2 获取原数据 进行遍历 修改
    let { tabs } = this.data
    tabs.forEach((n, i) => i === index ? n.isActive = true : n.isActive = false);
    // 3 赋值
    this.setData({
      tabs
    })
  },

  handletabsItenChange(e) {
    // 1 获取被点击的索引
    const { index } = e.detail
    this.changTitleByIndex(index)
  },
})

// 没法获取到token值 该功能无法实现 
// async getOrders(type) {
  //   const res = await request({ url: '/my/orders/all', data: type })
  //   this.setData({
  //     orders: res.orders
  //   })

  // },

  // onShow() {
  //   const token = wx.getStorageSync('token')
  //   if (!token) {
  //     wx.navigateBack({
  //       url: '/pages/auth/index'
  //     })
  //     return
  //   }

  //   // 1. 获取小程序的页面数组
  //   let pages = getCurrentPages()
  //   console.log(pages);
  //   // 2 最大索引就是当前页面
  //   let type = pages[pages.length - 1].options.type
  //   this.getOrders(type)
  // },

  // async getOrders(type) {
  //   const res = await request({ url: '/my/orders/all', data: type })
  //   this.setData({
  //     orders: res.orders
  //   })

  // },