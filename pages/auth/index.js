// pages/auth/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
import { login } from '../../utils/asyncWx.js'

Page({
  async handleGetUserInfo(e) {
    // console.log(e);
    try {
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 2 获取小程序登入成功后的code
      const { code } = await login()
      const loginParams = { encryptedData, rawData, iv, signature, code };
      wx.setStorageSync('loginParams', loginParams)
      //  3 把loginParams 代替了token存入缓存 同时返回上一个页面 
      wx.navigateBack({
        delta: 1,
        fail: (err) => {
          console.log(err);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // 因该账号非企业账号 无法实现支付 
  // 获取用户信息
  // async handleGetUserInfo(e) {
  //   try {
  //     // 1 获取用户信息
  //     const { encryptedData, rawData, iv, signature } = e.detail
  //     // 2 获取小程序登入成功后的code
  //     const { code } = await login()
  //     const loginParams = { encryptedData, rawData, iv, signature, code };
  //     // 3 发送请求 获取用户的token
  //     const token = await request({
  //       url: '/users/wxlogin',
  //       data: loginParams,
  //       method: 'post'
  //     })
  //     // 4 把token存入缓存 同时返回上一个页面
  //     wx.setStorageSync('token', token);
  //     wx.navigateBack({
  //       delta: 1,
  //       fail: (err) => {
  //         console.log(err);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
})