// pages/about/about.js
import _storage from '../../tools/storage.js';
import _http from '../../tools/http.js';
const _app = getApp();
const _global = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that=this;
    _http.get({
      url: _global.URL + "picture/api/weatherPic",
      success(res){
        console.log(res);
        _that.setData({
          picture:res.data.picture
        })
      }
    })
  },
  share(){},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
  return{
    title:"T天气小程序",
    path:"/pages/weather/weather",
  }
  }
})