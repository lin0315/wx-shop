// pages/category/index.js
import { request } from '../../request/index.js'
Page({
  /**
    * 页面的初始数据
    */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 左侧被点击的菜单
    currentIndex: 0
  },
  // 接口返回的数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates()

  },
  // 获取分类数据
  getCates() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    })
      .then(res => {
        console.log(res);
        this.Cates = res.data.message

        // 构造左侧菜单数据
        let leftMenuList = this.Cates.map(n => n.cat_name)
        // 构造右侧商品数据
        let rightContent = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContent
        })
      })
  }
})