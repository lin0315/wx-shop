// pages/goods_detail/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;
    const { goods_id } = options;
    this.getGoddsDestail(goods_id)

  },

  // 发送请求获取数据
  async getGoddsDestail(goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } })
    this.GoodsInfo = goodsObj
    // 1获取缓存中收藏商品的数组
    let collect = wx.getStorageSync('collect') || [];
    // 2判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
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
  },

  // 点击收藏 事件
  handleCollect() {
    let isCollect = false;
    // 1 获取收藏的商品数组
    let collect = wx.getStorageSync('collect') || [];
    // 2 判断当前商品是否在收藏数组中
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 index != 1 表示能找到 有收藏
    if (index !== -1) {
      // 收藏数组中删除该商品 即不收藏
      collect.splice(index, 1);
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      // 收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    };
    // 4 更新缓存
    wx.setStorageSync('collect', collect)
    // 5 更新data 中的 isCollect
    this.setData({
      isCollect
    })
  },

  // 点击购买 事件
  handlePurchase() {
    wx.showToast({
      title: '抱歉！ 请加入购物车 到购物车下单',
      icon: 'none',
      mask: true,
      duration: 3000
    })
  }
})
