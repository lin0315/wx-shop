// pages/goods_detail/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoddsDestail(goods_id)

  },

  // 发送请求获取数据
  async getGoddsDestail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },

  // 轮播图点击放大预览事件
  handlePreviewImage(e) {
    // 1. 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(n => n.pics_mid)
    // 2. 接收被传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      urls,
      current
    })
  },

  // 点击添加购物车事件
  handleCartAdd() {
    // 获取缓存中的购物车数据 数组格式
    let cart = wx.getStorageSync('cart') || []
    // 遍历数组判断当前商品是否存在
    let index = cart.findIndex(n => n.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 存在 执行数量++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存区
    wx.setStorageSync('cart', cart);
    // 弹窗提醒
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    })
  }
})
