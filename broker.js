const broker = require("aedes")();
const http = require("http");
const websocket = require("websocket-stream");
const mqtt = require("net").createServer(broker.handle);

const wsServer = http.createServer();
websocket.createServer({ server: wsServer }, broker.handle);

wsServer.listen(8883, () => {
  console.log("Broker MQTT running on port 8883");
});

mqtt.listen(1883, () => {
  console.log("Broker MQTT running on port 1883");
});
