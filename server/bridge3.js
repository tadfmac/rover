//
// bridge3.js
// 
// websocket message from multiple clients pass to multiple masters
//
// usage:
// 
// $ npm install ws
// $ npm install date-utils
// $ node bridge3.js
//

require('date-utils');

// Websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3003}); 
var connections = [];
var masterconns = [];
var datetime = {};

function getDateTime(){
  var dt = new Date();
  datetime = dt.toFormat("YYYY-MM-DD HH24:MI:SS");
}

wss.on('connection', function (ws) {
  getDateTime();
  ws.orguid = ws._socket._handle.fd;
  ws.ismaster = false;

  connections.push(ws);
  console.log(datetime+" [new connection]uid:"+ws.orguid);
    
  ws.on('close', function () {
    getDateTime();
    connections = connections.filter(function (conn, i) {
      if(conn === ws){
        console.log(datetime+" [connection closed]uid:"+conn.orguid);
        return false;
      }else{
        return true;
      }
    });
    masterconns = masterconns.filter(function (conn, i) {
      if(conn === ws){
        console.log(datetime+" [master closed]uid:"+conn.orguid);
        return false;
      }else{
        return true;
      }
    });
  });

  ws.on('message', function (message,flags) {
    getDateTime();
    if(flags.binary){
      for(var cnt1=0;cnt1 < message.length; cnt1++){
        console.log(datetime+" [message(bin)]uid:"+ws.orguid+" data["+cnt1+"]:"+message[cnt1]);
      }
      broadcast(message);
    }else{
      if(message == "ping"){
        ws.send("ack");
      }else if(message == "master"){
        for(var cnt = 0;cnt < connections.length; cnt++){
          if(connections[cnt] === ws){
            connections[cnt].ismaster = true;
            masterconns.push(connections[cnt]);
            console.log(datetime+" [master added]uid:"+connections[cnt].orguid);
            break;
          }
        }
        ws.send("master ack");
      }else if(message == "getconnections"){
        var result = {};
        result.message = "result getconnections";
        result.connections = new Array();
        for(var cnt=0;cnt < connections.length; cnt++){
          var data = {};
          data.uid = connections[cnt].orguid;
          data.ismaster = connections[cnt].ismaster;
          result.connections.push(data);
        }
        var json = JSON.stringify(result);
        ws.send(json);
      }else if(message == "getmasters"){
        var result = {};
        result.message = "result getmasters";
        result.masters = new Array();
        for(var cnt=0;cnt < masterconns.length; cnt++){
          result.masters.push(masterconns[cnt].orguid);
        }
        var json = JSON.stringify(result);
        ws.send(json);
      }else{
        console.log(datetime+" [message(txt)]uid:"+ws.orguid+" message:"+message);
        broadcast(message);
      }
    }
  });

  setInterval(function(){
    connections.forEach(function (con, i) {
      if(con.readyState == 1){
        con.ping("p");
      }else{
        console.log(datetime+" [ping failed]uid:"+con.orguid);
      }
    });
  },5000);

});

function broadcast(message) {
  masterconns.forEach(function (con, i) {
    if(con.readyState == 1){
      con.send(message);
    }else{
      console.log(datetime+" [broadcast failed]:uid"+con.orguid);
    }
  });
};



