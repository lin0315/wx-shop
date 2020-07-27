/*
 1. 用户上滑页面 滚动条触底 加载下一页数据
  1. 写滚动条触底事件 onReachBottom(){}
  2. 判断还有没有下一页数据
    1. 获取总条数total 还有总页数totalPages 一页显示的条数即页容量pagesize
      总页数 = Math.ceil(总条数total / 页容量pagesize)
      titalPages = Mach.ceil(23 / 10)
    2. 获取当前页码数 pagenum
    3. 判断一下 当前页码数 大于等于 总页数
        true 则没有下一页
  3. 如果没有下页数据 弹出提示消息
  4. 如果有数据 加载数据
    1. 当前页码数 ++
    2. 重新发送请求
    3. 数据请求回来 要进行拼接 而不是全部替换

 2. 下拉刷新页面
  1. 触发下拉事件 需要在页面json文件中开启配置 enablePullDownRefresh
      写下拉事件 onPullDownRefresh(){}
  2. 重置数据 goodsList[]
  3. 重置页码 为1
  4. 重新发送请求
  5. 数据请求回来 需要手动关闭 等待效果
*/

// pages/goods_list/index.js
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
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口数据
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 0, //总页数

  handletabsItenChange(e) {
    // 获取被点击的索引
    const { index } = e.detail
    // 获取原数据 进行遍历
    let { tabs } = this.data
    tabs.forEach((n, i) => i === index ? n.isActive = true : n.isActive = false);
    // 赋值
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList()
  },

  // 获取商品数据列表
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams })
    // console.log(res);
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    // 旧数据和新数据拼接
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },

  // 监听滚动触底 事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有更多数据了',
      })
    } else {
      // 有下一页数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  // 监听下拉刷新 事件
  onPullDownRefresh() {
    // 重置数据
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  }
})