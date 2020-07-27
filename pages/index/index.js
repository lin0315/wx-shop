// 导入网络请求
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    swiperList: [],
    // 导航 数组
    catesList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  // 获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata' })
      .then(result => {
        let swiperList = result
        swiperList.forEach(v => {
          v.navigator_url = v.navigator_url.replace('main', 'index')
        })
        this.setData({
          swiperList
        })
      })
  },

  // 获取分类导航数据
  getCateList() {
    request({ url: '/home/catitems' })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  // 获取楼层数据
  // 获取分类导航数据
  getFloorList() {
    request({ url: '/home/floordata' })
      .then(result => {
        result.forEach(v => {
          v.product_list.forEach(n => {
            n.navigator_url = n.navigator_url.replace('?', '/index?')
          })
        })
        this.setData({
          floorList: result
        })
      })
  }
})