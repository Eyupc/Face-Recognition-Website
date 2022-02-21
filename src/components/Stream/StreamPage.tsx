import React, { useState } from "react";
import NavBar from "../static-parts/NavBar";


type MessageState = {
    "image":string
}

export class StreamPage extends React.Component<{},MessageState> {
private ws:WebSocket;
private encoder:TextEncoder;
private decoder:TextDecoder;

private id:string | undefined;
private PingEvent:any | undefined;

constructor(props = {}){
    super(props);
    this.encoder = new TextEncoder()
    this.decoder = new TextDecoder()
    this.ws = new WebSocket("ws://10.3.41.63:7777");
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => this.onOpen();
    this.ws.onmessage = (msg) => this.onMessage(msg);
    this.ws.onerror = (err) => this.onError(err);
    this.ws.onclose = () => this.onClose();

    this.state = {
        "image":""
    }

}

onOpen():void {
this.id =Math.random().toString(36).substring(2);
let json  = `{"header":"ConnectionEvent","data":[{"id":"${this.id}"}]}`;
this.ws.send(this.encoder.encode(json))
this.PingPong(this.ws); //Ping Pong event every {amount} sec.
}

private PingPong(websocket:WebSocket){
    let data = {
        "header":"PingEvent",
        "data":[{
            "message":"Pong"
        }]
    }
    let encoder = this.encoder;
    this.PingEvent = setInterval(function(){

        websocket.send(encoder.encode(JSON.stringify(data))) //send ping
    },1000); //every 3 secs a ping pong event
}

onMessage(msg:any){
    let incoming = JSON.parse(this.decoder.decode(msg.data));
    if(incoming.header == "StreamEvent"){
    this.setState(()=>{
        return{image:incoming.data[0].message}
   });
    }
}

onError(err:any){
    console.log("Error: "+ err.toString());
}

onClose(){
    console.log("closed")
    clearInterval(this.PingEvent)
}

render() {
return(<div className="flex flex-col justify-center items-center h-full sm:h-screen">
<div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
    <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <div className="flex flex-col md:flex-col">
          <NavBar/>
          <div className="mb-4 p-4">
        <img src={'data:image/jpg;base64,'+this.state.image}/>
          </div></div></div></div></div>)
}

}