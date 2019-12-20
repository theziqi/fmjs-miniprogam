const app = getApp()

Page({
  data: {
    title: "",
    show: "",
    content: "",
    isLike: false,
    id: "",
    modalName: null,
    cmlist: [],
    likeSrc: "../../static/2-2-dianzan-1.png",
    unlikeSrc: "../../static/2-2-dianzan-2.png",
    likeCount: null,
    shareCount: null,
    cmValue: "",
    disable: true
  },

  updateValue: function(e) {
    this.setData({
      cmValue: e.detail.value,
      disable: !(e.detail.value.length > 0)
    });

  },

  getCmlist: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        opt: {
          tpid: that.data.id
        }
      }
    }).then(res => {
      console.log(res)
      console.log("获取" + that.data.id + "评论");
      console.log(res.result);
      that.setData({
        cmlist: res.result.comments
      });
    })
  },

  getLSnums: function() {
    var that = this;
    console.log(that.data.id)
    wx.cloud.callFunction({
      name: 'getCount',
      data: {
        opt: {
          tpid: that.data.id
        }
      }
    }).then(res => {
      console.log(res.result);
      that.setData({
        likeCount: res.result.like,
        shareCount: res.result.share
      });
    })
  },

  sendComment: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'postComment',
      data: {
        opt: {
          session_key: app.globalData.session_key,
          nickname: app.globalData.userInfo.nickName,
          comment: that.data.cmValue,
          tpid: that.data.id
        }
      }
    }).then(res => {
      console.log(res.result);
			that.setData({
				cmValue: ""
			});
			that.getCmlist();
    });
  },

  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: "/pages/entry/entry?id=" + this.data.id
    }
  },

  onShare: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'like',
      data: {
        opt: {
          session_key: app.globalData.session_key,
          action: "POST",
          tpid: that.data.id,
          choice: "share"
        }
      }
    }).then(res => {
      console.log(res.result);
      console.log("分享成功");
			that.getLSnums();
    });
  },

  changeLike: function() {
    var that = this;
    if (that.data.isLike) {
      wx.cloud.callFunction({
        name: 'like',
        data: {
          opt: {
            session_key: app.globalData.session_key,
            action: "DELETE",
            tpid: that.data.id,
            choice: "like"
          }
        }
      }).then(res => {
        console.log(res.result);
				if(res.result.state){
        console.log("取消点赞");
        that.setData({
          isLike: false
        });
				that.getLSnums();
				}
      });
    } else {
      wx.cloud.callFunction({
        name: 'like',
        data: {
          opt: {
            session_key: app.globalData.session_key,
            action: "POST",
            tpid: that.data.id,
            choice: "like"
          }
        }
      }).then(res => {
        console.log(res.result);
				if (res.result.state) {
        console.log("点赞成功");
        that.setData({
          isLike: true
        });
					that.getLSnums();
				}
      });
    };

  },

  onLoad: function(options) {
    wx.cloud.init()
    var that = this;
    wx.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
    that.data.id = options.id;
    wx.cloud.callFunction({
      name: 'getTP',
      data: {
        opt: {
          tpid: options.id
        }
      }
    }).then(res => {
      console.log(res.result.timepoint.show)
      that.setData({
        title: res.result.timepoint.title,
        show: typeof res.result.timepoint.show.show == "string" ? res.result.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前') : res.result.timepoint.show.show,
        content: res.result.timepoint.content
      });
    });

    this.getCmlist();
    this.getLSnums();
  }
})