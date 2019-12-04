import regeneratorRuntime from '../../utils/runtime.js'

const app = getApp()

var objM = {};

var plugin = requirePlugin("QCloudAIVoice")
plugin.setQCloudSecret(, , )//此处填入你的腾讯云APPID，SecretId，SecretKeSecretKeyy
let manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    isEntries: false,
    sResult: [],
    showList: [],
    sValue: "",
    page: 1,
    pageSize: 10,
    isLastPage: false,
    isInputing: false,
		isSpeaking: false,
		showS: true
  },

  updateValue: function(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },

  inputing: function() {
    this.setData({
      isInputing: true
    })
  },

  uninputed: function() {
    this.setData({
      isInputing: false
    })
  },

	onVoice: function(){
		this.setData({
			isSpeaking: true
		})
    manager.start()
	},

	endVoice: function () {
		this.setData({
			isSpeaking: false
		})
    manager.stop()
	},

  onSearch: function() {
    var that = this;
    that.setData({
      sResult: [],
      showList: [],
      page: 1,
      isLastPage: false
    });
    console.log("开始搜索：" + this.data.sValue);
    wx.cloud.callFunction({
      name: 'search',
      data: {
        opt: {
          keyword: that.data.sValue
        }
      }
    }).then(res => {

      if (res.result.result.length) {
        that.setData({
          sResult: res.result.result
        });
        console.log(that.data.sResult);
        that.getDetails();
      } else {
        wx.showToast({
          title: 'Sorry~还未收录相关信息QAQ',
          icon: 'none',
          duration: 2000,
        })

      }


    });

  },

  toEntry: function(e) {
    wx.navigateTo({
      url: '../entry/entry?id=' + e.currentTarget.dataset.id,
      success: function(res) {
        console.log("跳转成功")
      },
      fail: function(res) {},
      complete: function(res) {},
    });
  },

  onReachBottom: function() {
    if (this.data.isLastPage) {
      return
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getDetails();
  },

  getDetails: function(tp) {
    var that = this;
    var s;
    let d = [];
    var listLength = this.data.sResult.length;
    var size = this.data.pageSize;
    if (this.data.page == listLength / size) {
      s = this.data.sResult.slice(size * (this.data.page - 1), listLength - 1);
      that.setData({
        isLastPage: true
      });
    } else {
      s = this.data.sResult.slice(size * (this.data.page - 1), size * this.data.page);
    }
    s.forEach(function(item, index) {
      if (tp) {
        var id = item.tpid;
      } else {
        var id = item.id;
      }
      wx.cloud.callFunction({
        name: 'getTP',
        data: {
          opt: {
            tpid: id
          }
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: 'getCount',
          data: {
            opt: {
              tpid: id
            }
          }
        }).then(res1 => {
          wx.cloud.callFunction({
            name: 'getComment',
            data: {
              opt: {
                tpid: id
              }
            }
          }).then(res2 => {
            {
              console.log(res2.result.comments)
              objM = {
                title: res.result.timepoint.title,
                show: typeof res.result.timepoint.show.show == "string" ? res.result.timepoint.show.show.replace(/ - /g, ' 至 ').replace(/-/g, '公元前') : res.result.timepoint.show.show,
                content: (res.result.timepoint.content.length <= 40) ? res.result.timepoint.content : res.result.timepoint.content.slice(0, 39) + "...",
                id: id,
                like: res1.result.like,
                comments: res2.result.comments.length
              };
              d.push(objM);
              if (index == 9 || (listLength < 10 && index == listLength - 1)) {
                that.setData({
                  showList: that.data.showList.concat(d)
                });
                console.log(d);
              }

            }
          })


        })

      });
    });
  },

  onLoad: function(options) {
    var that=this;
    
    manager.onStart(function(res) {
      console.log('recorder start', res.msg)
    })
    manager.onRecognize(function (res){
      console.log('recorder stop', res)
      that.setData({
        sValue:res.result.replace('。','')
      })
    })
    manager.onStop(function(res){
      that.onSearch()
    });
    wx.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
    if (options.list != null) {
      var list = JSON.parse(options.list);
      console.log(list)
      this.setData({
        isEntries: true,
        sResult: list,
				showS: false
      });
      var tp = true;
      this.getDetails(tp);
    } else if (options.s) {
      console.log(options)
      console.log("传入搜索值：" + options.s)
      this.setData({
        sValue: options.s
      });
      this.onSearch();
    } else {
      this.onSearch();
    }
  }
})