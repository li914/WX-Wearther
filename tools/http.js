const _get = function(obj) {
  let url = obj.url || '';
  let success = obj.success || function(res) {};
  let fail = obj.fail || function(res) {};
  wx.request({
    url: url,
    success: function(res) {
      if (res.statusCode == 200) {
        success(res.data);
      }else{
        fail(res);
      }
    },
    fail: function(res) {
      fail(res);
    }
  })
}
const _post = function(obj) {
  let url = obj.url || '';
  let param = obj.param || {};
  let success = obj.success || function(res) {};
  let fail = obj.fail | function(res) {};
  wx.request({
    url: url,
    method: 'POST',
    data: param,
    success: function(res) {
      if (res.statusCode == 200) {
        success(res.data);
      } else {
        fail(res);
      }
    },

    fail: function(res) {
      fail(res);
    }
  })
}

module.exports = {
  get: _get,
  post: _post
}