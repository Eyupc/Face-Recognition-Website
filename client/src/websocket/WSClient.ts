import React, { useState } from "react";

export class WSClient {
  private ws: WebSocket;
  private _encoder: TextEncoder = new TextEncoder();
  private _decoder: TextDecoder = new TextDecoder();
  private _page: string;
  private PingEvent: any | undefined;
  private _userid = "";

  public static ws: WSClient | undefined;
  constructor(host: string, port: number, secure: boolean, page: string) {
    this.ws = secure
      ? new WebSocket("wss://" + host + ":" + port.toString())
      : new WebSocket("ws://" + host + ":" + port.toString());
    this.ws.binaryType = "arraybuffer";
    this._page = page;
    this.ws.onerror = (err) => this.onError(err);
    this.ws.onclose = () => this.onClose();
    this.ws.onopen = () => this.onOpen();

    WSClient.ws = this;
  }

  public static getInstance() {
    if (WSClient.ws === undefined) {
      WSClient.ws = new WSClient("10.3.41.63", 7777, false, "HomePage");
    }
    return WSClient.ws;
  }

  onError(err: any) {
    console.log(err);
  }

  onClose() {
    clearInterval(this.PingEvent);
    console.log("Connection closed!");
  }
  onOpen(): void {
    this._userid = Math.random().toString(36).substring(2);
    let connection = {
      header: "ConnectionEvent",
      data: [
        {
          id: this._userid,
          page: this._page,
        },
      ],
    };
    this.ws.send(this.encoder.encode(JSON.stringify(connection)));
    this.PingPong(this.ws); //Ping Pong event every {amount} sec.
  }

  private PingPong(websocket: WebSocket) {
    let data = {
      header: "PingEvent",
      data: [
        {
          message: "Pong",
        },
      ],
    };
    let encoder = this.encoder;
    this.PingEvent = setInterval(function () {
      websocket.send(encoder.encode(JSON.stringify(data))); //send ping
    }, 1000); //every 3 secs a ping pong event
  }

  get websocket() {
    return this.ws;
  }

  get encoder() {
    return this._encoder;
  }
  get decoder() {
    return this._decoder;
  }
  get userId() {
    return this._userid;
  }
  set setPage(page: string) {
    this._page = page;

    let json = {
      header: "SetPageEvent",
      data: [
        {
          id: this._userid,
          page: page,
        },
      ],
    };
    if (this.ws.OPEN === this.ws.readyState) {
      this.ws.send(this.encoder.encode(JSON.stringify(json)));
    }
  }
}
