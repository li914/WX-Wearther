// pages/search/search.js
import _storage from '../../tools/storage.js';
import _http from '../../tools/http.js';
const _app = getApp();
const _global = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotCity: [],
    // cityList: [],
    iconColor: '#B2B2B2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    var location = _storage.getSync('location');
    // console.log(location == undefined);
    this.setData({
      locationCity: location
    })

    var _that = this;
    wx.request({
      url: _global.URL+'location/api/top',
      success: function(res) {
        // console.log(res);
        _that.setData({
          hotCity: res.data.data
        })
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var location = _storage.getSync('location');
    // console.log(location == undefined);
    this.setData({
      locationCity: location
    })
  },
  inputFocus(e) {
    var _that = this;
    // console.log(e);
    let value = e.detail.value;
    // console.log(value.trim().length);
    let iconColor = '#B2B2B2';
    if (!value.trim()) {
      this.setData({
        iconColor: iconColor,
        value: ""
      });
      return;
    }
    iconColor = 'green';
    this.setData({
      iconColor: iconColor,
      value: value
    });
    console.log(value.length);
    if (value.length < 2) {
      _that.setData({
        searchCityList: []
      });
      return;
    }
    _http.get({
      url: _global.URL+'location/api/find?location=' + value,
      success: function(res) {
        // console.log(res);
        if (res.code == 1 && res.msg == 'ok') {
          console.log(res.data);
          _that.setData({
            searchCityList: res.data
          });
        }
      }
    });
  },
  clearInputText() {
    console.log(this.data.value)
    this.setData({
      value: "",
      iconColor: "#B2B2B2",
      searchCityList: []
    })
  },
  choosesHotCity(e) {
    // var currentLocation=_storage.getSync('currentLoccation');
    var location = _storage.getSync('location');
    var currentLocation = _storage.getSync('currentLocation');
    var item = e.currentTarget.dataset.item;
    var isSava = true;
    for (let i = 0; i < location.length; ++i) {
      if (location[i].cid == item.cid) {
        isSava = false;
      }
    }
    if (isSava) {
      location.push(item);
      _storage.setSync('location', location);
      this.setData({
        locationCity: location
      })
    }
    if (item.cid == currentLocation.cid) {
      item.selected = true;
    } else {
      item.selected = false;
    }
    _storage.setSync('currentLocation', item);
    this.navTo();
    console.log(location);
  },

  navTo() {
    var _that = this;
    wx.switchTab({
      url: '/pages/weather/weather',
      success: function(res) {
        _that.setData({
          value: "",
          iconColor: "#B2B2B2",
          searchCityList: []
        })
      }
    });
  },

  delCity(e) {
    var location = _storage.getSync('location');
    var current = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    var currentLocation = _storage.getSync('currentLocation');
    console.log(current);
    if (current == 0) {
      this.toast("对不起，默认城市不允许删除！");
      return;
    }
    if(item.cid==currentLocation.cid){
      // let current = location[0];
      _storage.setSync('currentLocation', location[0]);
    }
    location.splice(current, 1);
    this.setData({
      locationCity: location
    });
    _storage.setSync('location', location);
  },
  toast: function(content) {
    wx.showToast({
      title: content,
      icon: 'none',
      duration: 2000,
      complete: (res) => {
        console.log(res);
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})