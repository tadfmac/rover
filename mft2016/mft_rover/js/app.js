// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded


window.addEventListener('DOMContentLoaded', function() {
  var command;

  var host = "ws://mz4u.net:3003";
  var ws = new poorws(host);
  var status = 0;

  ws.onStatusChange = function(sts){
    status = sts;
    if(sts == 0){
      console.log("poorws:Connecting...");
    }else if(sts == 1){
      console.log("poorws:Connected");
    }else if(sts == 2){
      console.log("poorws:Disconnecting...");
    }else if(sts == 3){
      console.log("poorws:Disconnected(Re-Connecting...)");
    }
  };

  ws.onOpen = function(e){
    ws.send("master");
  };

  // Log errors
  ws.onError = function (error) {
    console.log('WebSocket Error ' + error);
  };

     // Log messages from the server
  ws.onMessage = function (e) {
    console.log('Server: ' + e.data);
    command = e.data;
    if (command === "0") {
      console.log(command);
    }
    navigator.requestGPIOAccess()
    .then(gpioAccess=>{
      var port1 = gpioAccess.ports.get(198);
      var port2 = gpioAccess.ports.get(199);
      var port3 = gpioAccess.ports.get(245);
      var port4 = gpioAccess.ports.get(243);
      return Promise.all([
        port1.export("out"),
        port2.export("out"),
        port3.export("out"),
        port4.export("out")
        ]).then(()=>{
        if (command == 0){
          console.log(command);
          port1.write(0);
          port2.write(0);
          port3.write(0);
          port4.write(0);
        }
        if (command == 1){
          console.log(command);
          port1.write(1);
          port2.write(1);
          setTimeout(function(){
            port1.write(0);
            port2.write(0);
          },5000);
        }
        if (command == 2){
          console.log(command);
          port1.write(1);
          port4.write(1);
          setTimeout(function(){
            port1.write(0);
            port4.write(0);
          },5000);
        }
        if (command == 3){
          console.log(command);
          port2.write(1);
          port3.write(1);
          setTimeout(function(){
            port2.write(0);
            port3.write(0);
          },5000);
        }
        if (command == 4){
          console.log(command);
          port3.write(1);
          port4.write(1);
          setTimeout(function(){
            port3.write(0);
            port4.write(0);
          },5000);
        }
      });
    });
  };
});
