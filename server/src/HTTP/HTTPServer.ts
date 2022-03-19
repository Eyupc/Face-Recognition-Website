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

type JWTDeCode  = {
    data:{
    _id: number,
    _username:string,
    _rank:number
    }
}

export class HTTPServer {
  private _host: string;
  private _port: number;
  private _express = express();
  private _http: http.Server;
  private _router = express.Router();
  private RedisClient = new RedisClient();

  private secret: string = "ditIs22ee8nGeheim69@ok!_77@_899";

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

    this._express.post("/auth/login", async (req, res) => {
      let login = await Main.databaseService.tryToLogin(
        String(req.body.username),
        String(req.body.password)
      );
      if (JSON.parse(login).status === "OK") {
        let token = jsonToken.sign(
          { data: JSON.parse(login).data },
          this.secret,
          { expiresIn: "120m" }
        );
        res.cookie("FC_SESSION", token, {
          expires: new Date(new Date().setHours(new Date().getHours() + 1)),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        res.send({
          status: "OK",
          token: token,
        });
      } else {
        res.send(JSON.parse(login));
      }
    });

    this._express.get("/auth/check", async (req, res, next) => {
      await this.checkAuth(req, res, next, true);
    });

    this._express.post("/auth/logout", async (req, res, next) => {
      if (req.cookies.FC_SESSION) {
        await this.RedisClient.getClient().hSet(
          "tokens",
          req.cookies.FC_SESSION.toString()
        );
        res.clearCookie("FC_SESSION");
        res.end();
      }
    });

    this._express.get("/admin/deleteUsers", async (req, res, next) => {
      let auth = await this.checkAuth(req, res, next, false);
      if (JSON.parse(auth).status == "failed") {
        res.send(auth);
        return;
      }
      res.send(
        await Main.databaseService.queryFind({
          collection: "users_whitelisted",
          params: {},
        })
      );
    });

    this._express.get(
      "/admin/deleteUsers/cmd_delete",
      async (req, res, next) => {
        let auth = await this.checkAuth(req, res, next, false);
        if (JSON.parse(auth).status == "failed") {
          res.send(auth);
          return;
        }
        let del = await Main.databaseService.queryDelete({
          collection: "users_whitelisted",
          params: { id: Number(req.query.id) },
        });
        if (del.status == "OK") {
          res.send({ status: "OK" });
        } else {
          res.send({ status: "failed" });
        }
      }
    );

    this._express.get("/admin/home", async (req, res, next) => {
      let auth = await this.checkAuth(req, res, next, false);
      if (JSON.parse(auth).status == "failed") {
        res.send(auth);
        return;
      }

      let data = await Main.databaseService.queryFind({
        collection: "config",
        params: {},
      });
      return res.send(data);
    });

    this._express.get("/admin/addAdmin", async (req, res, next) => {
      let auth = await this.checkAuth(req, res, next, false);
      if (JSON.parse(auth).status == "failed") {
        res.send(auth);
        return;
      }
      
      let checkRank = await this.checkRank(req.cookies.FC_SESSION);
      if(!checkRank){
          res.send({status:"failed",reason:"You don't have this permission."});
          return;
      }

      let checkUsername = await this.checkUsername(String(req.query.username));
      if(!checkUsername){
        res.send({status:"failed",reason:"This username already exist!"})
        return;
      }

      let doc = await Main.databaseService.lastDocument({collection:"staffs",params:{}});
      let lastId = doc[0].id + 1; // +1 last id

      await Main.databaseService.queryInsert({collection:"staffs",
                                            params:{id:lastId,username:String(req.query.username),
                                                    email:String(req.query.email),
                                                    password:bcrypt.hashSync(String(req.query.password),12),
                                                    rank:Number(req.query.rank)}})
     res.send({status:"OK"})
    });
  }


  async checkAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    send: boolean
  ): Promise<any> {
    let returnVal = null;
    if (!req.cookies.FC_SESSION) {
      returnVal = send
        ? res.send(JSON.stringify({ status: "failed" }))
        : JSON.stringify({ status: "failed" });
    }
    var tokens = await this.RedisClient.getClient().hKeys("tokens");
    if (tokens.includes(req.cookies.FC_SESSION)) {
      res.clearCookie("FC_SESSION");
      returnVal = send
        ? res.send(
            JSON.stringify({ status: "failed", reason: "Invalid token" })
          )
        : JSON.stringify({ status: "failed", reason: "Invalid token" });
    }

    // console.log(tokens)

    if (req.cookies.FC_SESSION) {
      jsonToken.verify(
        req.cookies.FC_SESSION,
        this.secret,
        (err: any, user: any) => {
          if (err) {
            returnVal = send
              ? res.send(
                  JSON.stringify({ status: "failed", reason: "Invalid token" })
                )
              : JSON.stringify({ status: "failed", reason: "Invalid token" });
          } else {
            returnVal = send
              ? res.send(
                  JSON.stringify({
                    status: "OK",
                    token: req.cookies.FC_SESSION,
                  })
                )
              : JSON.stringify({
                  status: "OK",
                  token: req.cookies.FC_SESSION,
                });
          }
        }
      );
    }
    return returnVal;
  }

  async checkRank(token: string) {
    var info :JWTDeCode = jwt(token);
    //console.log(info)
    if (info.data._rank > 1) {
      return true;
    } else {
      return false;
    }
  }
  
  async checkUsername(_username:string){
    let username = _username;

    let data = await Main.databaseService.queryFind({
        collection: "staffs",
        params: { username: { $regex: new RegExp(username, "i") } },
    });
    if(JSON.parse(data).status === "failed"){
        return true; // return true if username doesnt exist
    }else {
        return false;
    }
    
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
    var tokens = await this.RedisClient.getClient().hKeys("tokens");
    tokens.forEach((element) => {
      jsonToken.verify(element, this.secret, async (err: any, user: any) => {
        if (err) {
          await this.RedisClient.getClient().hDel("tokens", element);
        }
      });
    });
  }
}
