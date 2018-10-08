const toast= function(content) {
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 2000,
    complete: (res) => {
      console.log(res);
    }
  })
}
module.exports={
  toast:toast
}
