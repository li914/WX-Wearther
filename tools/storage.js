const _set = function(key, data) {
  wx.setStorage({
    key: key,
    data: data,
  })
}
const setSync = function(key, data) {
  try {
    wx.setStorageSync(key, data);
  } catch (e) {
    console.log(e);
  }
}
const _get = function(key) {
  wx.getStorage({
    key: key,
    success: function(res) {
      console.log(res.data);
      if (res.data) {
        data = res.data;
      }
    },
    fail: function(res) {
      console.log(res)
    }
  });
}
const getSync = function(key) {
  try {
    var vaule = wx.getStorageSync(key);
    if (vaule) {
      return vaule;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
const remove = function(key) {
  wx.removeStorage({
    key: key,
    success: function(res) {},
  });
}
const removeSync = function(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.log(e);
  }
}
const clear = function() {
  wx.clearStorage();
}
const clearSync = function() {
  try {
    wx.clearStorageSync();
  } catch (e) {
    console.log(e);
  }
}
const getInfoSync=function(){
  try{
    var res=wx.getStorageInfoSync();
    return res;
  }catch(e){
    console.log(e);
  }
}
module.exports = {
  set: _set,
  setSync: setSync,
  get: _get,
  getSync: getSync,
  remove: remove,
  removeSync: removeSync,
  clear: clear,
  clearSync: clearSync
}