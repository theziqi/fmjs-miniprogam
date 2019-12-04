const app = getApp()

Page({
  data: {
    timer: "",
    avatarUrl: "",
    isStartGame: false,
    isClosetoEnd: false,
    isEndGame: false,
    countDownNum: 45,
    score: 0,
    answer: null,
    selected: null,
    yesSrc: "../../static/3-2-dui-1.png",
    noSrc: "../../static/3-2-cuo-1.png",
    id0: "",
    title0: "",
    year0: "",
    showS0: "",
    id1: "",
    title1: "",
    year1: "",
    showS1: "",
    n_id0: "",
    n_title0: "",
    n_year0: "",
    n_id1: "",
    n_title1: "",
    n_year1: "",
    n_answer: null,
    sValue: "",
    rank: null,
    total: null,
    isfirstaction: true
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
			path: "/pages/index/index"
		}
  },

  rec() {
    this.setData({
      isStartGame: false,
      isClosetoEnd: false,
      isEndGame: false,
      score: 0,
      countDownNum: 45,
      answer: null,
      selected: null,
      percent: null
    });
  },

  updateValue: function (e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },

  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.data.timer = setInterval(function () {
      if (countDownNum == 0) {
        that.setData({
          isEndGame: true,
          isStartGame: false
        });
        wx.cloud.callFunction({
          name: 'gameScore',
          data: {
            opt: {
              session_key: app.globalData.session_key,
              points: that.data.score
            }
          }
        }).then(res => {
          that.setData({
            rank: res.result.rank,
            total: res.result.total,
            percent: Math.round((1 - res.result.rank / res.result.total) * 100),
          });
        });

        clearInterval(that.data.timer);
      } else {
        countDownNum--;
        if (countDownNum == 10) {
          that.setData({
            isClosetoEnd: true
          })
        }
        that.setData({
          countDownNum: countDownNum
        })
      }
    }, 1000)
  },

  onSearch() {
    var that = this;
    console.log(that.data.sValue);
    wx.navigateTo({
      url: '../search/search?s=' + that.data.sValue,
      success: function (res) {
        console.log("跳转成功")
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

  onLoad() {
    wx.cloud.init();
		wx.showShareMenu({
			showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
		});
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl
    });
  },

  selectAnswer: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    this.setData({
      isfirstaction: false,
      selected: id,
      showS0: that.data.answer ? "trueBox" : "falseBox",
      showS1: !that.data.answer ? "trueBox" : "falseBox",
    });
    if ((id == "0" && that.data.answer) || (id == "1" && !that.data.answer)) {
      that.setData({
        score: that.data.score + 1
      });
    };
    var timeOut = setTimeout(function () {
      that.setData({
        selected: null,
        showS0: "",
        showS1: "",
        isfirstaction: true
      });
      that.getQuestion();
      clearTimeout(timeOut);
    }, 800);

  },

	getsimpleYear(show) {
		var yy;
		console.log(show)
		if (show.type[0] == 20 || show.type[0] == 40) {
			yy = show.date[0].replace(/-/g, '公元前') + "年"
		} else {
			yy = show.show
		}
		return yy;
	},

  getn_Question() {
    var that = this;
    wx.cloud.callFunction({
      name: 'playGame',
      data: {
        opt: {}
      }
    }).then(res => {
      that.setData({
        n_id0: res.result.picked[0],
        n_id1: res.result.picked[1],
        n_answer: res.result.result
      });
      wx.cloud.callFunction({
        name: 'getTP',
        data: {
          opt: {
            tpid: that.data.n_id0
          }
        }
      }).then(res0 => {
        that.setData({
          n_title0: res0.result.timepoint.title,
					n_year0: that.getsimpleYear(res0.result.timepoint.show),
        });

        wx.cloud.callFunction({
          name: 'getTP',
          data: {
            opt: {
              tpid: that.data.n_id1
            }
          }
        }).then(res1 => {
          that.setData({
            n_title1: res1.result.timepoint.title,
						n_year1: that.getsimpleYear(res1.result.timepoint.show),
          });
          console.log(that.data.n_id0 + "," + that.data.n_id1)
        });
      });
    });
  },

  getQuestion() {
    var that = this;
    this.setData({
      id0: that.data.n_id0,
      title0: that.data.n_title0,
      year0: that.data.n_year0,
      id1: that.data.n_id1,
      title1: that.data.n_title1,
      year1: that.data.n_year1,
      answer: that.data.n_answer
    });
    that.getn_Question();
  },

  startGame: function () {
    var that = this;
    /*this.setData({
      isStartGame: true
    });
    this.countDown();*/
    wx.cloud.callFunction({
      name: 'playGame',
      data: {
        opt: {}
      }
    }).then(res => {
        that.setData({
          id0: res.result.picked[0],
          id1: res.result.picked[1],
          answer: res.result.result
        });
        wx.cloud.callFunction({
          name: 'getTP',
          data: {
            opt: {
              tpid: that.data.id0
            }
          }
        }).then(res0 => {
          that.setData({
            title0: res0.result.timepoint.title,
						year0: that.getsimpleYear(res0.result.timepoint.show),
          });
          wx.cloud.callFunction({
            name: 'getTP',
            data: {
              opt: {
                tpid: that.data.id1
              }
            }
          }).then(res1 => {
            that.setData({
              title1: res1.result.timepoint.title,
              year1: that.getsimpleYear(res1.result.timepoint.show),
            });
            console.log(that.data.id0 + "," + that.data.id1)
            that.getn_Question();
            that.setData({
              isStartGame: true
            });
            that.countDown();
          });
        });
      });
  }
})