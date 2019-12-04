//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  toTimeline: function () {
    console.log('toTimeline on.')
    wx.navigateTo({
      url: '../timeline/timeline'
    })
  },
  toSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  toGame: function () {
    wx.navigateTo({
      url: '../game/game'
    })
  },
  onLoad: function () {
    wx.cloud.init();
    var that = this;
		wx.showShareMenu({
			showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
		});
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          console.log(res.code);
          wx.cloud.callFunction({
            name: 'login',
            data: {
              opt: {
                code: res.code
              }
            }
          }).then(res => {
              console.log(res.result);
              app.globalData.session_key = res.result.session_key;
              console.log(app.globalData.session_key);
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

    wx.getSystemInfo({
      success: function (res) {
          app.globalData.systemInfo = res;
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
