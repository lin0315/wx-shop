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
    request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata' })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })
  },

  // 获取分类导航数据
  getCateList() {
    request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems' })
      .then(result => {
        this.setData({
          catesList: result.data.message
        })
      })
  },

  // 获取楼层数据
  // 获取分类导航数据
  getFloorList() {
    request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata' })
      .then(result => {
        this.setData({
          floorList: result.data.message
        })
      })
  }
})