import express, { query } from "express";
import path from "path";
import * as http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Main } from "../index";
import jsonToken, { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jwt-decode";
import RedisClient from "../Redis/RedisClient";
import jwtDecode from "jwt-decode";
import bcrypt from "bcrypt"

import Login from "./routes/Login"
import Check from "./routes/auth/Check";
import Logout from "./routes/auth/Logout"
import DeleteUsers from "./routes/admin/DeleteUsers/DeleteUsers"
import cmdDelete from "./routes/admin/DeleteUsers/cmdDelete"
import Home from "./routes/admin/Home"
import AddAdmin from "./routes/admin/AddAdmin"
export class HTTPServer {
  private _host: string;
  private _port: number;
  private _express = express();
  private _http: http.Server;
  private _router = express.Router();

  public static secret: string = "ditIs22ee8nGeheim69@ok!_77@_899";

  private redisTimer: any;

  constructor(host: string, port: number) { 
    this._host = host;
    this._port = port;
    this._express.set("port", port);

    this._express.use(cookieParser());
    this._express.use(bodyParser.json());
    this._express.use(
      cors({
        origin: ["http://localhost:3000", "http://192.168.0.180:3000"],
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        credentials: true,
      })
    );

    this._http = new http.Server(this._express);
    this.routes();
    this.redisTimer = setInterval(
      async () => this.clearRedis(),
      1000 * 60 * 30
    ); //check om de 30 min om te clearen
  }

  private routes() {
    this._express.get("/", function (req, res, next) {
      res.send(JSON.stringify(req.cookies));
    });

    this._express.post("/auth/login",Login);
    this._express.get("/auth/check", Check);
    this._express.post("/auth/logout", Logout);
    this._express.get("/admin/deleteUsers", DeleteUsers);
    this._express.get("/admin/deleteUsers/cmd_delete",cmdDelete);
    this._express.get("/admin/home", Home);
    this._express.get("/admin/addAdmin", AddAdmin);
  }

  public get port(): number {
    return this._port;
  }
  public get host(): string {
    return this._host;
  }
  public get http(): http.Server {
    return this._http;
  }

  public Start(): void {
    this._http.listen(this._port, this._host, () => {
      console.log(
        "Running on:\r\nHost: " + this.host + "\r\n" + "Port: " + this.port
      );
    });
  }

  private async clearRedis() {
    var tokens = await RedisClient.getClient().hKeys("tokens");
    tokens.forEach((element) => {
      jsonToken.verify(element, HTTPServer.secret, async (err: any, user: any) => {
        if (err) {
          await RedisClient.getClient().hDel("tokens", element);
        }
      });
    });
  }
}
