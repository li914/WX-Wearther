// pages/weather/weather.js
import _storage from '../../tools/storage.js';
import _http from '../../tools/http.js';
const _app=getApp();
const _global = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // aqi: [],
    // hourly_forecast: [],
    // daily_forecast: [],
    // now: [],
    // suggestion: []
    picture: "http://cn.bing.com/az/hprichbg/rb/FlamingoCousins_EN-US13543498875_1920x1080.jpg"
  },

  getAuthor() {
    var _that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
      }
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          _that.openSetting();
        }
      }
    })
  },

  openSetting() {
    var _that = this;
    // wx.openSetting({
    //   success: (res) => {
    //     if (!res.authSetting['scope.userLocation']) {
    //       _that.showRemind();
    //     } else {
    //       _that.getMyLocation(_that);
    //     }
    //   },
    //   fail: (res) => {
    //     if (!res.authSetting['scope.userLocation']) {
    //       _that.showRemind();
    //     }
    //   }
    // })

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              _that.getMyLocation(_that);
            }
          })
        }
      }
    })
  },

  showRemind() {
    var _that = this;
    wx.showModal({
      title: '温馨提醒',
      content: '需要获取您的地理位置才能使用小程序',
      showCancel: false,
      confirmText: '获取位置',
      success: function(res) {
        if (res.confirm) {
          _that.getAuthor();
        }
      },
      fail: (res) => {
        _that.getAuthor();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getAuthor();
    console.log('onLoad');
    this.picture();
    var _that = this;
    var location = _storage.getSync('currentLocation');
    console.log('onload', location);
    var currentLocation = _storage.getSync('currentLocation');
    console.log(location == "undefined");
    if (!location) {
      console.log('onload', 'zaizheli');
      wx.getSetting({
        success(res) {
          console.log('onload', 'zaizheli1111');
          console.log(res.authSetting["scope.userLocation"]);
          console.log(res.authSetting["scope.userLocation"] == undefined);
          if (!res.authSetting["scope.userLocation"]) {
            console.log('onload', 'zaizheli2222');
            wx.authorize({
              scope: 'scope.userLocation',
              success(e) {
                console.log(e);
                console.log('onload', 'zaizhel33333');
                _that.getMyLocation(_that);
              },
              fail(e) {
                console.log(e);
                _that.showRemind();
              },
              complete(e) {
                console.log(e);
              }
            });
          } else {
            _that.getMyLocation(_that);
          }
        },
      })
    } else {
      _that.requestWeather(currentLocation.cid, _that);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("onReady")
    console.log(_app);
    console.log(_global.URL);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // console.log(this.week(new Date().getDay()));
    console.log("onShow");
    var _that = this;

    this.getMyLocation(this);

    var currentLocation = _storage.getSync('currentLocation');
    console.log(currentLocation);
    if (currentLocation) {
      if(!currentLocation.selected){
        let cid = currentLocation.cid;
        this.requestWeather(cid, this);
        currentLocation.selected = true;
        _storage.setSync("currentLocation", currentLocation);
      }
    }
  },

  week(nowDay) {
    switch (nowDay) {
      case 1:
        return new Array("星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天");
      case 2:
        return new Array("星期二", "星期三", "星期四", "星期五", "星期六", "星期天", "星期一")
      case 3:
        return new Array("星期三", "星期四", "星期五", "星期六", "星期天", "星期一", "星期二");
      case 4:
        return new Array("星期四", "星期五", "星期六", "星期天", "星期一", "星期二", "星期三");
      case 5:
        return new Array("星期五", "星期六", "星期天", "星期一", "星期二", "星期三", "星期四");
      case 6:
        return new Array("星期六", "星期天", "星期一", "星期二", "星期三", "星期四", "星期五");
      case 0:
        return new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    }
  },

  getMyLocation(_that) {
    // console.log('getMylocation');
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        let param = 'location=' + res.longitude + ',' + res.latitude;
        console.log(param);
        _http.get({
          //url: 'https://api.li914.com/location/find?' + param,
          url: _global.URL+'location/api/find?' + param,
          success: function(res) {
            console.log(res,'find');
            var currentLocation = _storage.getSync('currentLocation');

            if (currentLocation) {
              return;
            }
            let arr = new Array();
            arr.push(res.data[0]);
            console.log(arr);
            _storage.setSync('location', arr);
            let item = res.data[0];
            item.selected = true;
            _storage.setSync('currentLocation', item);
            let cid = res.result[0].cid;
            _that.requestWeather(cid, _that);
          },
          fail: function(res) {
            console.log(res);
          },
        });
      },
      fail(res) {
        // console.log('getMyLocation', res);
        _that.showRemind();
      }
    })
  },
  requestWeather(city, _that) {
    wx.showLoading({
      title: '天气数据加载中',
    });
    let url = _global.URL+'weather/api/allInfo?city=' + city;
    _http.get({
      url: url,
      success: function(res) {
        console.log(res,"1111");
        if (res.code == 1 && res.msg == 'ok') {
          let basic = res.data.basic;
          let aqi = res.data.aqi;
          let hourly_forecast = res.data.hourly_forecast;
          let daily_forecast = res.data.daily_forecast;
          let now = res.data.now;
          let suggestion = res.data.suggestion;
          let updateTime = basic.update.loc.split(' ')[1];
          _that.setData({
            basic: basic,
            aqi: aqi,
            hourly_forecast: hourly_forecast,
            daily_forecast: daily_forecast,
            now: now,
            suggestion: suggestion,
            updateTime: updateTime
          });
          // _that.canvasHourly(hourly_forecast);
          _that.dataTime(daily_forecast);
          _storage.setSync('weather', res.data);
          _that.stopToast();
          _that.stopPullRef();
          _that.hourlyTime(hourly_forecast);
          _that.canvasDaily(daily_forecast);
        }
      }
    });
  },

  hourlyTime(hourly_forecast) {
    var arr = new Array();
    for (let i = 0; i < hourly_forecast.length; ++i) {
      let time = hourly_forecast[i].date.split(" ")[1];
      arr.push(time);
    }
    // console.log(arr);
    this.setData({
      hourlyTime: arr
    })
  },



  stopToast() {
    wx.hideLoading();
  },
  stopPullRef() {
    wx.stopPullDownRefresh();
  },

  dataTime(daily_forecast) {
    // console.log(daily_forecast);
    var arr = new Array();
    for (let i = 0; i < daily_forecast.length; ++i) {
      let time = daily_forecast[i].date.substr(5);
      // console.log(time);
      arr.push(time);
    }
    // console.log(arr);
    this.setData({
      dayTime: arr
    })
  },

  picture() {
    var _that = this;
    _http.get({
      // url: "https://api.li914.com/picture/weatherPic",
      url:_global.URL+"picture/api/weatherPic",
      success(res) {
        console.log(res);
        _that.setData({
          picture: res.data.picture
        })
      }
    })
  },

  canvasDaily(dailyResult) {
    var _that = this;
    let scrennWidth = wx.getSystemInfoSync().screenWidth;
    var canvas = wx.createCanvasContext("day_canvas", this);
    var length = dailyResult.length;
    var week = this.week(new Date().getDay())
    console.log('new Date().getDay()', new Date().getDay())

    var d_minTmp = 1000;
    var d_maxTmp = -1000;

    for (let i = 0; i < length; ++i) {
      let tmp = parseInt(dailyResult[i].tmp.max);
      if (d_maxTmp <= tmp) {
        d_maxTmp = tmp;
      }
      if (d_minTmp > tmp) {
        d_minTmp = tmp;
      }
    }
    console.log(d_minTmp, d_maxTmp)

    var d_gap = (d_maxTmp - d_minTmp) / 1.0;
    d_gap = (d_gap == 0.0 ? 1.0 : d_gap);

    var d_maxPointH = 190;
    var d_minPointH = 220;
    let interval = parseInt(scrennWidth / length);
    var d_pointUnitH = (d_minPointH - d_maxPointH) / d_gap;

    var startX, startY, stopX, stopY;
    startY = 0, stopY = 380;
    canvas.save();
    canvas.setStrokeStyle("rgba(155,155,155,0.5)");
    for (let i = 0; i < length; ++i) {
      canvas.setLineWidth(1);
      canvas.beginPath();
      startX = stopX = (i + 1) * interval;
      canvas.moveTo(startX, startY);
      canvas.lineTo(stopX, stopY);
      canvas.stroke();
    }
    canvas.restore();

    var x, y;

    canvas.save();
    canvas.setStrokeStyle("#fff");
    canvas.beginPath();
    for (let i = 0; i < length; ++i) {
      let item = dailyResult[i];
      var time = item.date.substr(5);
      var d_CondTxt = item.cond.txt_d;
      var d_CondCode = item.cond.code_d;
      var d_Tmp = item.tmp.max;
      let tmpGap = d_Tmp - d_minTmp;
      // var n_CondTxt = item.cond.txt_n;
      // var n_CondCode = item.cond.code_n;
      // var n_Tmp = item.tmp.min;
      // var dir = item.wind.dir;
      // var sc = item.wind.sc;

      x = i * interval + interval / 2.0;
      //上边文字处理
      canvas.setTextAlign("center");
      canvas.setFillStyle("#fff");
      canvas.setFontSize(12);
      canvas.fillText(time, x, 15);
      canvas.fillText(week[i], x, 35);
      canvas.fillText(d_CondTxt, x, 55);
      canvas.drawImage("/images/weatherPic/w_" + d_CondCode + ".png", x - 15, 65, 32, 32);
      //上边折现处理
      y = (360 - (d_maxPointH + tmpGap * d_pointUnitH));
      if (i == 0) {
        canvas.moveTo(0, 360 - d_maxPointH);
      }
      canvas.lineTo(x, y);
      canvas.fillText(d_Tmp + "℃", x, y - 15);
      canvas.arc(x, y, 3, 0, 2 * Math.PI);
      if (i == length - 1) {
        canvas.lineTo(scrennWidth, y - 20);
      }
    }
    canvas.stroke();
    canvas.restore();

    var n_minTmp = 1000;
    var n_maxTmp = -1000;

    for (let i = 0; i < length; ++i) {
      let tmp = parseInt(dailyResult[i].tmp.min);
      if (n_maxTmp <= tmp) {
        n_maxTmp = tmp;
      }
      if (n_minTmp > tmp) {
        n_minTmp = tmp;
      }
    }

    var n_gap = (n_maxTmp - n_minTmp) / 1.0;
    n_gap = (n_gap == 0.0 ? 1.0 : n_gap);

    var n_maxPointH = 90;
    var n_minPointH = 120;
    // let interval = parseInt(scrennWidth / length);
    var n_pointUnitH = (n_minPointH - n_maxPointH) / d_gap;

    canvas.save();
    canvas.beginPath();
    canvas.setLineWidth(1);
    canvas.setStrokeStyle("#fff");
    //处理下边折现以及文字
    for (let i = 0; i < length; ++i) {
      let item = dailyResult[i];
      var n_CondTxt = item.cond.txt_n;
      var n_CondCode = item.cond.code_n;
      var n_Tmp = item.tmp.min;
      var dir = item.wind.dir;
      var sc = item.wind.sc;
      let tmpGap = n_Tmp - n_minTmp;

      x = i * interval + interval / 2.0;


      y = (360 - (n_maxPointH + tmpGap * n_pointUnitH));
      console.log(y);
      // y = (480 - (maxPointH + tmpGap * pointUnitH));
      canvas.setTextAlign("center");
      canvas.setFillStyle("#fff");
      canvas.setFontSize(12);

      canvas.fillText(dir, x, 375);
      canvas.fillText(n_CondTxt, x, 355);
      canvas.drawImage("/images/weatherPic/w_" + n_CondCode + ".png", x - 15, 315, 30, 30);



      if (i == 0) {
        canvas.moveTo(0, 360 - n_maxPointH);
      }
      canvas.lineTo(x, y);
      canvas.fillText(n_Tmp + "℃", x, y + 25);
      canvas.arc(x, y, 3, 0, 2 * Math.PI);
      if (i == length - 1) {
        canvas.lineTo(scrennWidth, y + 20);
      }

    }

    canvas.stroke();
    canvas.restore();

    canvas.draw();


  },

  canvasHourly: function(hourlyResult) {
    var _that = this;
    var length = hourlyResult.length;
    var count = 1.65;
    // console.log(length);
    if (length != 8) {
      length = 24;
      count = 4;
    }
    // console.log('length',length);
    let scrennWidth = wx.getSystemInfoSync().screenWidth;
    this.setData({
      canvasWidth: scrennWidth * count
    })
    var canvas = wx.createCanvasContext("hourly_forecast", this);

    let minTmp = 1000;
    let maxTmp = -1000;
    for (let i = 0; i < length; ++i) {
      let tmp = parseInt(hourlyResult[i].tmp);
      if (minTmp > tmp) {
        minTmp = tmp;
      }
      if (maxTmp < tmp) {
        maxTmp = tmp;
      }
    }
    console.log(minTmp, maxTmp);

    let gap = (maxTmp - minTmp) / 2.0;
    gap = (gap == 0.0 ? 1.0 : gap);
    let maxPointH = 255;
    let minPointH = 285;
    let pointUnitH = (minPointH - maxPointH) / gap;

    //间隔距离大小
    let interval = parseInt((scrennWidth * count) / length);
    // console.log(interval);
    //画竖线
    let startX, startY, stopX, stopY;
    startY = 0;
    stopY = 480;
    canvas.save();
    canvas.setStrokeStyle("rgba(155,155,155,0.5)");
    for (let i = 0; i < length - 1; ++i) {
      canvas.setLineWidth(1);
      canvas.beginPath();
      startX = stopX = (i + 1) * interval;
      canvas.moveTo(startX, startY);
      canvas.lineTo(stopX, stopY);
      canvas.stroke();
    }
    // canvas.restore();
    // canvas.stroke();

    let x, y;
    canvas.save();
    canvas.setStrokeStyle("#fff");
    canvas.beginPath();
    for (let i = 0; i < length; ++i) {
      let tmp = parseInt(hourlyResult[i].tmp);
      let time = hourlyResult[i].date.split(" ")[1];
      let condInfo = hourlyResult[i].cond.txt;
      let condCode = hourlyResult[i].cond.code;
      let windDir = hourlyResult[i].wind.dir;
      let windSc = hourlyResult[i].wind.sc;
      let tmpGap = tmp - minTmp;


      x = i * interval + interval / 2.0;
      //画天气文字
      canvas.setTextAlign("center");
      canvas.setFillStyle("#fff");
      canvas.setFontSize(12);

      canvas.fillText(time, x, 470);
      canvas.fillText(condInfo, x, 450);


      //画文字 风
      canvas.save();
      canvas.setTextAlign("center");
      canvas.setFillStyle("#fff");
      canvas.setFontSize(10);
      canvas.fillText(windDir, x, 25);
      canvas.fillText(windSc, x, 45);
      canvas.restore();
      //画 天气图标
      canvas.save();
      canvas.drawImage("/images/weatherPic/w_" + condCode + ".png", x - 15, 385, 32, 32);

      //画折线
      y = (480 - (maxPointH + tmpGap * pointUnitH));
      if (i == 0) {
        canvas.moveTo(0, 480 - maxPointH);
      }
      canvas.lineTo(x, y);
      canvas.fillText(tmp + "℃", x, y - 15);
      canvas.arc(x, y, 3, 0, 2 * Math.PI);
      if (i == length - 1) {
        canvas.lineTo(scrennWidth * count, y - 20);
      }
    }
    canvas.stroke();
    canvas.draw(false, function() {
      wx.canvasToTempFilePath({
        canvasId: 'hourly_forecast',
        // destWidth: scrennWidth * count,
        destHeight: 360,
        // width:scrennWidth*count,
        height: 360,
        quality: 1,
        success(res) {
          console.log(res);
          _that.setData({
            canvasSavaPath: res.tempFilePath
          });
        }
      })
    });
    // wx.canvasToTempFilePath({
    //   canvasId: 'hourly_forecast',
    //   width: scrennWidth * count,
    //   height: 320,
    //   success(res) {
    //     console.log(res);
    //     _that.setData({
    //       canvasSavaPath: res.tempFilePath
    //     })
    //   }
    // })


    this.stopToast();
  },
  canvasSavaPath(_that) {
    wx.canvasToTempFilePath({
      canvasId: 'hourly_forecast',
      // width: scrennWidth * count,
      // height: 480,
      // destHeight:480,
      success(res) {
        console.log(res);
        this.setData({
          canvasSavaPath: res.tempFilePath
        })
      }
    })
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
    var _that = this;
    wx.showLoading({
      title: '天气信息更新中',
    });
    // wx.startPullDownRefresh({})
    var currentLocation = _storage.getSync('currentLocation');
    console.log(currentLocation);
    _that.requestWeather(currentLocation.cid, _that);
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