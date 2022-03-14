import express from 'express';
import path from 'path';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"
import cors from 'cors'
import {Main} from '../index'
import jsonToken, { JsonWebTokenError } from "jsonwebtoken"
import jwt_decode from "jwt-decode";
import RedisClient from '../Redis/RedisClient';


interface ZMember {
    score: number;
    value: string;
}

export class HTTPServer{

    private _host:string;
    private _port:number;
    private _express = express();
    private _http:http.Server;
    private _router = express.Router();
    private RedisClient = new RedisClient();

    private secret:string = "ditIs22ee8nGeheim69@ok!_77@_899";

    private redisTimer:any;
    
    constructor(host:string, port:number){
        this._host = host;
        this._port = port;
        this._express.set("port",port);


        this._express.use(cookieParser())
        this._express.use(bodyParser.json())
        this._express.use(cors({
            origin: ['http://localhost:3000','http://192.168.0.180:3000'],
            methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
            credentials: true
          }))

        this._http = new http.Server(this._express);
        this.routes()
        this.redisTimer = setInterval(async()=>this.clearRedis(),(1000*60*30)) //check om de 30 min om te clearen
    }


    private routes(){
        this._express.get("/", function(req, res, next) {
            res.send(JSON.stringify(req.cookies));
        });

        this._express.post("/auth/login",async (req,res)=>{
        let login = await Main.databaseService.tryToLogin(String(req.body.username),String(req.body.password));
        if(JSON.parse(login).status === "success"){
        let token = jsonToken.sign({ data:JSON.parse(login).data }, this.secret,{expiresIn:"120m"});
        res.cookie("FC_SESSION", token,
                {
                    expires: new Date(new Date().setHours(new Date().getHours() + 1)),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax"
                })
            
        res.send({
            status:"success",
            token: token 
        })
    }else {
        res.send(JSON.parse(login))
    }
    })

    this._express.get("/auth/check",async (req,res,next)=>{
    await this.checkAuth(req,res,next,true);
    })

    this._express.post("/auth/logout",async(req,res,next)=>{
        if(req.cookies.FC_SESSION){
       await this.RedisClient.getClient().hSet("tokens",req.cookies.FC_SESSION.toString());
        res.clearCookie("FC_SESSION");
        res.end();
        }
    })

    this._express.get("/admin/deleteUsers",async(req,res,next)=>{
        let auth = await this.checkAuth(req, res, next, false);
      if(JSON.parse(auth).status =="failed"){
      res.send(auth);
      return;
      }
      res.send(await Main.databaseService.query({collection:"users_whitelisted",params:{}}))
      console.log("ok")
    })

}
    async checkAuth(req:express.Request,res:express.Response,next:express.NextFunction,send:boolean):Promise<any>{
        let returnVal = null;
        if(!req.cookies.FC_SESSION){
        returnVal =  (send ? res.send(JSON.stringify({status:"failed"})) : JSON.stringify({status:"failed"}));
        
        }
    var tokens = await this.RedisClient.getClient().hKeys("tokens");
    if(tokens.includes(req.cookies.FC_SESSION)){
        res.clearCookie("FC_SESSION");
        returnVal =  (send ? res.send(JSON.stringify({status:"failed",reason:"Invalid token"})) : JSON.stringify({status:"failed",reason:"Invalid token"})); 
    }
   // console.log(tokens)

    if(res){
    jsonToken.verify(req.cookies.FC_SESSION,this.secret,(err:any,user:any)=>{
    if(err){
        returnVal =  (send ? res.send(JSON.stringify({status:"failed",reason:"Invalid token"})) : JSON.stringify({status:"failed",reason:"Invalid token"})); 
    }else{
    returnVal =  (send ? res.send(JSON.stringify({status:"success",token:req.cookies.FC_SESSION})) : JSON.stringify({status:"success",token:req.cookies.FC_SESSION}));
    }})
}
return returnVal;

}

    

    public get port():number {
        return this._port;
    }
    public get host():string{
        return this._host;
    }
    public get http():http.Server{
        return this._http;
    }

    public Start():void{
        this._http.listen(this._port,this._host,()=>{
            console.log("Running on:\r\nHost: " +this.host + "\r\n" + "Port: " + this.port);
        });

    }
    
    private async clearRedis(){
        var tokens = await this.RedisClient.getClient().hKeys("tokens");
        tokens.forEach(element => {
            jsonToken.verify(element,this.secret,async (err:any,user:any)=>{
                if(err){
                    await this.RedisClient.getClient().hDel("tokens",element);
                }
            })
        });
    }

}