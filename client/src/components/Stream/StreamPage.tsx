import React, { useState } from "react";
import { WSClient } from "../../websocket/WSClient";
import NavBar from "../static-parts/NavBar";


type MessageState = {
    "image":string
}

export class StreamPage extends React.Component<{},MessageState> {
private WSClient:WSClient;
private ws:WebSocket;


constructor(props = {}){
    super(props);
    this.WSClient = WSClient.getInstance();
    this.WSClient.setPage = "StreamPage"
    this.ws= this.WSClient.websocket; 

    this.ws.onmessage = (msg) => this.onMessage(msg);
    this.state = {
        "image":""
    }   
}

onMessage(msg:any){
    let incoming = JSON.parse(this.WSClient.decoder.decode(msg.data));
    if(incoming.header == "StreamEvent"){
    this.setState(()=>{
        return{image:'data:image/jpg;base64,'+incoming.data[0].message}
   });
    }
}


render() {
    let message = ((this.ws.readyState === this.ws.OPEN) ? <img src={this.state.image}/> : "Connection closed :(")
return(<div className="flex flex-col justify-center items-center h-screen sm:h-screen">
<div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
    <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
    <div className="flex flex-col md:flex-col">
          <NavBar/>
          <div className="mb-4 p-4">
          {message}
          </div></div></div></div></div>)
}

}