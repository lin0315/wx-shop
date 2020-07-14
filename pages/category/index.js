// pages/category/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

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
    currentIndex: 0,
    // 右侧商品滚动条
    scrollTop: 0
  },
  // 接口返回的数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1/先判断本地存储有没有数据
    // 2。没数据再发送请求 有数据判断是否过期 若过期则发送请求

    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(n => n.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     // console.log(res);
    //     this.Cates = res

    //     // 把接口数据存入本地存储
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     // 构造左侧菜单数据
    //     let leftMenuList = this.Cates.map(n => n.cat_name)
    //     // 构造右侧商品数据
    //     let rightContent = this.Cates[0].children

    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    // 使用ES7的async await 发送请求
    const res = await request({ url: "/categories" })
    this.Cates = res
    // 把接口数据存入本地存储
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 构造左侧菜单数据
    let leftMenuList = this.Cates.map(n => n.cat_name)
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightContent
    })
  },

  // 监听左侧菜单点击
  handleItemTap(e) {
    // 获取左侧菜单被点击的索引
    const { index } = e.currentTarget.dataset;
    // 构造右侧商品数据
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 右侧商品滚动距离
      scrollTop: 0
    })
  }
})