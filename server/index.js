import { join , resolve} from 'path'
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import config from '../config'
import fs from 'fs';
import path from 'path'

var mqtt=require('mqtt')

const MIDDLEWARES = ['database', 'general', 'router', 'parcel']
const iccidlocal = path.resolve(__dirname, '../', 'config/iccidlocal.txt')
var iccid=fs.readFileSync(iccidlocal)
var iccidstr=iccid.toString()
iccidstr=iccidstr.replace(/[\r\n]/g,"")
console.log('iccid--->>>',iccid.toString())
// var HID = require('node-hid')
// console.log('hid--dev--->>>',HID.devices())
// var hid = new HID.HID(1356,2508)
// // var hid = new HID.HID(9571,1315)
// hid.on('data',function(data){
//   console.log('hid-data--->>>',data)
// })

const nodegamepad = require('apollocontroller')
// let gamepad = new nodegamepad('ps3');
// let gamepad = new nodegamepad('sb3');
let gamepad = new nodegamepad('ps4');
// let gamepad = new nodegamepad('kt_pc900_bananapi');

// gamepad.start();
gamepad.connect(function(){
  console.log('connected--<<<start');
})

gamepad.on('connected', function () {
    console.log('connected--<<<joy');
});
gamepad.on('disconnected', function () {
    console.log('disconnected');
});

// gamepad.on('left:move', function (e) {
//   console.log('left-move-->>>',e);
// });

// gamepad.on('right:move', function (e) {
//   console.log('right-move-->>>',e);
// });

// gamepad.on('JOYL:move', function (e) {
//   console.log('JOYL-move-->>>',e);
// });

// gamepad.on('JOYR:move', function (e) {
//   console.log('JOYR-move-->>>',e);
// });

// gamepad.on('Start:press', function () {
//     console.log('start');
// });
// gamepad.on('down:press', function () {
//     console.log('down');
// });




// const useMiddlewares = (app) => {
//   R.map(
//     R.compose(
//       R.forEachObjIndexed(
//         e => e(app)
//       ),
//       require,
//       name => resolve(__dirname, `./middleware/${name}`)
//     )
//   )(MIDDLEWARES)
// }

// async function start () {
//   const app = new Koa()
//   const { port } = config

//   await useMiddlewares(app)

//   const server = app.listen(port, () => {
//     console.log(
//       process.env.NODE_ENV === 'development'
//         ? `Open ${chalk.green('http://localhost:' + port)}`
//         : `App listening on port ${port}`
//     )
//   })
// }

// start()
// const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
var clientId = `mqtt_${iccidstr}`
var client = mqtt.connect(
//   process.env.NODE_ENV === 'development'
// ? `mqtt://localhost:1883`
// : `mqtt://broker.mnoiot.com:1883`
`mqtt://broker.mnoiot.com:1883`

,{
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'mno',
  password: '81525782',
  reconnectPeriod: 1000,
});
// Options???????????????:
// {
//   keepAlive: // ???????????? ??????60s, ??????0?????????
//   username: // ?????????
//   password: // ????????????
//   protocol: // ?????????????????????ws(websocket) wss???????????????websocket, ???http???https??????????????????, ??????ssl, tcp...
//   clientId: // ?????????id ????????????????????????????????????
//   clean: // boolean  ????????? false ????????????????????? QoS 1 ??? 2 ?????????
//   reconnectionProid: //???????????????????????????????????? ????????????
//   connectionTimeout: // ??????????????????
//   protocolID: ??? MQIsdp???// ????????????????????????mqtt????????? 5????????????, 3
//   protocolVersion: 3 
//   reconnection: // boolean ?????????????????????????????? ???????????????true
//   will: {
//     ... // ????????????????????????????????????
//   }
// }


client.on('connect', function () {

  console.log('>>> connected')

  client.subscribe(`/g500_${iccidstr}`)

  gamepad.on('JOYL:move', function (e) {
    // console.log('JOYL-move-->>>',e);
    let carmsg=JSON.stringify(e)
    client.publish(`/car_${iccidstr}`,carmsg)
  });
  
  gamepad.on('JOYR:move', function (e) {
    // console.log('JOYR-move-->>>',e);
    let carmsg=JSON.stringify(e)
        client.publish(`/car_${iccidstr}`,carmsg)
  });
  
  gamepad.on('S:press', function () {
      console.log('start');
      client.publish(`/car_${iccidstr}`,'start')
  });

  gamepad.on('T:press', function () {
    console.log('halfhalf');
    client.publish(`/car_${iccidstr}`,'halfhalf')
});

gamepad.on('O:press', function () {
  console.log('half');
  client.publish(`/car_${iccidstr}`,'half')
});

gamepad.on('X:press', function () {
  console.log('one');
  client.publish(`/car_${iccidstr}`,'one')
});
 
 })

 client.on('message', function (topic, message) {

  // message is Buffer
 
  console.log(message.toString())
 
 })