import * as zrender from '../../lib/zrender/zrender';
import * as zrhelper from '../../lib/zrender/zrender-helper';

import regeneratorRuntime from '../../utils/runtime.js'

const app = getApp();
const api = app.globalData.api;
var zr = [];
var timer;

Page({
  data: {
    pointsNum: 10,
    points: [],
    wWidthHalf: wx.getSystemInfoSync().windowWidth / 2,
    yearList: [],
    canvasList: [0],
    title: "",
    isAD: false,
    isLastPage: false,
    page: 0,
    startYear: 40000,
    scrollTop: null,
    isIOS: false,
    id: 0
  },

  onPageScroll: function(e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },

  toTop: function() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  onReady: function(e) {

  },

  downStart: function(e) {
    var that = this;
    timer = setInterval(function() {
      var dis = that.data.scrollTop + 10;
      if (dis < 0) {
        dis = 0;
      }
      console.log(dis);
      wx.pageScrollTo({
        scrollTop: dis,
        duration: 0
      })
    }, 30);
  },

  downEnd: function(e) {
    clearInterval(timer);
  },

  upStart: function(e) {
    var that = this;
    timer = setInterval(function() {
      var dis = that.data.scrollTop - 10;
      if (dis < 0) {
        dis = 0;
      }
      console.log(dis);
      wx.pageScrollTo({
        scrollTop: dis,
        duration: 0
      })
    }, 30);
  },

  upEnd: function(e) {
    clearInterval(timer);
  },

  changetoBC: function(e) {
    if (this.data.isAD) {
      wx.showToast({
        title: '切换为公元前',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        isAD: false,
        startYear: 40000
      });
      this.startS()
    }
  },

  changetoAD: function(e) {
    if (!this.data.isAD) {
      wx.showToast({
        title: '切换为公元后',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        isAD: true,
        startYear: 1
      });
      this.startS()
    }
  },

  updateValue: function(e) {
    let name = e.currentTarget.dataset.name;
    let nameMap = {}
    nameMap[name] = e.detail && e.detail.value
    this.setData(nameMap)
  },

  onReachBottom: function() {
    var that = this;
    if (this.data.isLastPage) {
      return
    }
    this.setData({
      page: that.data.page + 1,
      canvasList: that.data.canvasList.concat(0)
    });
    console.log(that.data.page);
    this.getDetails();

  },

  async drawTitle(y, cx, cy, n) {
    await this.getTitle(y, cx, cy, n);
  },

  getTitle(y, nowX, nowY, n) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
          name: 'getList',
          data: {
            opt: {
              year: y
            }
          }
        }).then(res => {
          if (res.result.list.length > 1) {
            var xingxing = new zrender.Image({
              style: {
                image: "../../static/2-xingxing-1.png",
                x: nowX - 10,
                y: nowY - 10,
                width: 20,
                height: 20
              },
              draggable: true
            });

            xingxing.on('mousedown', function(e) {
              console.log("单击了星星");
              var obj = JSON.stringify(res.result.list);
              wx.navigateTo({
                url: '../search/search?list=' + obj,
                success: function(res) {
                  console.log("跳转成功")
                },
                fail: function(res) {},
                complete: function(res) {},
              });
            });

            zr[n].add(xingxing);

            var text_year = new zrender.Text({
              style: {
                text: y < 0 ? '公元前' + (-y) : y,
                fontFamily: 'Source Han Sans CN',
                fontSize: 23,
                textFill: '#fefefe'
              },
              position: [nowX + 25, nowY - 10],
              draggable: true
            });

            text_year.on('mousedown', function(e) {
              var obj = JSON.stringify(res.result.list);
              wx.navigateTo({
                url: '../search/search?list=' + obj,
                success: function(res) {
                  console.log("跳转成功")
                },
                fail: function(res) {},
                complete: function(res) {},
              });
            });

            zr[n].add(text_year);
          } else {
            if (y < 0) {
              var text_title = new zrender.Text({
                style: {
                  text: res.result.list[0].title,
                  fontFamily: 'AliHYAiHei',
                  fontSize: 18,
                  textFill: '#fefefe'
                },
                position: [nowX + 105, nowY - 4],
                draggable: true
              });
            } else {
              var text_title = new zrender.Text({
                style: {
                  text: res.result.list[0].title,
                  fontFamily: 'AliHYAiHei',
                  fontSize: 18,
                  textFill: '#fefefe'
                },
                position: [nowX + 53, nowY - 4],
                draggable: true
              });
            }
            text_title.on('mousedown', function(e) {
              console.log("单击了标题");
              wx.navigateTo({
                url: '../entry/entry?id=' + res.result.list[0].tpid,
                success: function(res) {
                  console.log("跳转成功")
                },
                fail: function(res) {},
                complete: function(res) {},
              });
            });

            zr[n].add(text_title);

            var circle_arc = new zrender.Circle({
              shape: {
                cx: nowX,
                cy: nowY,
                r: 10
              },
              style: {
                fill: "#fcc200"
              },
              draggable: true
            });

            circle_arc.on('mousedown', function(e) {
              console.log("单击了标题");
              wx.navigateTo({
                url: '../entry/entry?id=' + res.result.list[0].tpid,
                success: function(res) {
                  console.log("跳转成功")
                },
                fail: function(res) {},
                complete: function(res) {},
              });
            });

            zr[n].add(circle_arc);

            var text_year = new zrender.Text({
              style: {
                text: y < 0 ? '公元前' + (-y) : y,
                fontFamily: 'Source Han Sans CN',
                fontSize: 15,
                textFill: '#a7a7a7'
              },
              position: [nowX + 13, nowY]
            });

            text_year.on('mousedown', function(e) {
              console.log("单击了标题");
              wx.navigateTo({
                url: '../entry/entry?id=' + res.result.list[0].tpid,
                success: function(res) {
                  console.log("跳转成功")
                },
                fail: function(res) {},
                complete: function(res) {},
              });
            });

            zr[n].add(text_year);
          }
          resolve();
        })
        .catch((err) => {
          console.error(err)
          reject(err)
        })
    })
  },

  toSearch: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  ctap: function(e) {
    console.log(e);
    let touch = e.touches[0];
    let id = e.target.dataset.id;
    this.setData({
      id: id
    })
    zr[id].handler.dispatch('mousedown', {
      zrX: touch.x,
      zrY: touch.y
    });
  },


  getDetails() {
    var that = this;
    if (that.data.yearList.length - that.data.page * that.data.pointsNum >= that.data.pointsNum) {
      var showyearList = that.data.yearList.slice(that.data.page * that.data.pointsNum, (that.data.page + 1) * that.data.pointsNum);
      var p = this.data.points;
    } else {
      var showyearList = that.data.yearList.slice(that.data.page * that.data.pointsNum, that.data.yearList.length - 1);
      var p = this.data.points.slice(0, that.data.yearList.length - that.data.page * that.data.pointsNum - 1);
      that.setData({
        isLastPage: true
      });
    }
    var n = that.data.page;
    zr[n] = zrhelper.createZrender('timeline-' + n, 360, 720);

    var scale = 0.25;

    for (var i = 0; i < p.length; i++) {
      var nowX = p[i]["x"],
        nowY = p[i]["y"],
        last1X, last1Y, last2X, last2Y, nextX, nextY, cAx, cAy, cBx, cBy;

      if (i != 0) {
        if (i === 1) {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 1]["x"]
          last2Y = p[i - 1]["y"]
          nextX = p[i + 1]["x"]
          nextY = p[i + 1]["y"]
        } else if (i === p.length - 1) {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 2]["x"]
          last2Y = p[i - 2]["y"]
          nextX = p[i]["x"]
          nextY = p[i]["y"]
        } else {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 2]["x"]
          last2Y = p[i - 2]["y"]
          nextX = p[i + 1]["x"]
          nextY = p[i + 1]["y"]
        }

        cAx = last1X + (nowX - last2X) * scale;
        cAy = last1Y + (nowY - last2Y) * scale;
        cBx = nowX - (nextX - last1X) * scale;
        cBy = nowY - (nextY - last1Y) * scale;


        var curve_line = new zrender.BezierCurve({
          shape: {
            x1: last1X,
            y1: last1Y,
            cpx1: cAx,
            cpy1: cAy,
            cpx2: cBx,
            cpy2: cBy,
            x2: nowX,
            y2: nowY,
            percent: 0
          },
          style: {
            lineWidth: 3,
            stroke: '#fcc200',
            lineDash: [5, 5],
            lineDashOffset: 0
          }
        });

        zr[n].add(curve_line);
        curve_line.animate('shape', false)
          .delay(400 * i)
          .when(400, {
            percent: 1
          })
          .start();
      }

      this.drawTitle(showyearList[i], nowX, nowY, n);

      console.log(this.data.title);


    }
  },

  drawP: function() {
    var that = this;
    zr[0] = zrhelper.createZrender('timeline-0', 360, 720);
    var p = this.data.points;
    var scale = 0.25;

    for (var i = 0; i < p.length; i++) {
      var nowX = p[i]["x"],
        nowY = p[i]["y"],
        last1X, last1Y, last2X, last2Y, nextX, nextY, cAx, cAy, cBx, cBy;

      if (i != 0) {
        if (i === 1) {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 1]["x"]
          last2Y = p[i - 1]["y"]
          nextX = p[i + 1]["x"]
          nextY = p[i + 1]["y"]
        } else if (i === p.length - 1) {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 2]["x"]
          last2Y = p[i - 2]["y"]
          nextX = p[i]["x"]
          nextY = p[i]["y"]
        } else {
          last1X = p[i - 1]["x"]
          last1Y = p[i - 1]["y"]
          last2X = p[i - 2]["x"]
          last2Y = p[i - 2]["y"]
          nextX = p[i + 1]["x"]
          nextY = p[i + 1]["y"]
        }

        cAx = last1X + (nowX - last2X) * scale;
        cAy = last1Y + (nowY - last2Y) * scale;
        cBx = nowX - (nextX - last1X) * scale;
        cBy = nowY - (nextY - last1Y) * scale;


        var curve_line = new zrender.BezierCurve({
          shape: {
            x1: last1X,
            y1: last1Y,
            cpx1: cAx,
            cpy1: cAy,
            cpx2: cBx,
            cpy2: cBy,
            x2: nowX,
            y2: nowY,
            percent: 0
          },
          style: {
            lineWidth: 3,
            stroke: '#fcc200',
            lineDash: [5, 5],
            lineDashOffset: 0
          }
        });

        zr[0].add(curve_line);
        curve_line.animate('shape', false)
          .delay(400 * i)
          .when(400, {
            percent: 1
          })
          .start();
      }

      if (i != p.length - 1) {
        this.drawTitle(that.data.yearList[i], nowX, nowY, 0);
      }
      console.log(this.data.title);


    }
  },

  startS() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getYearList',
      data: {
        opt: {
          tpid: that.data.id
        }
      }
    }).then(res => {

      console.log(res.result.year_list);
      that.setData({
        yearList: res.result.year_list
      });

      var year_list = that.data.yearList;
      console.log(year_list);

      if (that.data.isAD) {
        var sy = that.data.startYear;
      } else {
        var sy = -that.data.startYear;
      }
      for (var i = 0; i < year_list.length; i++) {
        if (sy <= year_list[i]) {
          year_list = year_list.slice(i, year_list.length - 1);
          break
        }
      }
      that.setData({
        yearList: year_list,
        canvasList: [0],
        page: 0,
        isLastPage: false
      });
      zr = [];
      console.log(that.data.yearList);
      that.drawP();


    });


  },

  onLoad: function() {
    var that = this;
    wx.showShareMenu({
      showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
    });
    console.log(app.globalData.systemInfo.platform)
    if (app.globalData.systemInfo.platform == "ios") {
      that.setData({
        isIOS: true
      });
    }
    let a = [];
    for (var i = 0; i < that.data.pointsNum + 1; i++) {
      a.push({
        "x": that.data.wWidthHalf - 85 + 30 * Math.pow(-1, i),
        "y": 80 * i + 10
      });
      if (i == that.data.pointsNum) {
        that.setData({
          points: a
        });
        console.log(that.data.points)
      }
    };
    that.startS()
  },
})