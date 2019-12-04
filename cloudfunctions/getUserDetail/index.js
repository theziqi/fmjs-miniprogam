// 云函数入口文件
const cloud = require('wx-server-sdk')

const got = require('got'); //引用 got

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  code = event.code;
  //let getResponse = await got('httpbin.org/get') //get请求 用httpbin.org这个网址做测试 
  //return getResponse.body
  let postResponse = await got('https://qq.timeline.hfzhang.wang/api/getUserDetail', {
    method: 'POST', //post请求
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event.opt)
  })

  return JSON.parse(postResponse.body) //返回数据
}