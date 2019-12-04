// 云函数入口文件
const cloud = require('wx-server-sdk')

const got = require('got'); //引用 got

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  let postResponse = await got('https://qq.timeline.hfzhang.wang/api/game/get', {
    method: 'GET', //post请求
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return JSON.parse(postResponse.body) //返回数据
}