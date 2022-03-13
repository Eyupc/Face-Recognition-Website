import express from 'express';
import path from 'path';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser"
import cors from 'cors'
import {Main} from '../index'


import jsonToken, { JsonWebTokenError } from "jsonwebtoken"
import jwt from "express-jwt"
import jwt_decode from "jwt-decode";


export class HTTPServer{

    private _host:string;
    private _port:number;
    private _express = express();
    private _http:http.Server;
    private _router = express.Router();

    private secret:string = "ditIs22ee8nGeheim69@ok!_77@_899";

    
    constructor(host:string, port:number){
        this._host = host;
        this._port = port;
    
        this._express.set("port",port);


        this._express.use(cookieParser())
        this._express.use(bodyParser.json())
       // this._express.use(jwt({ secret: this.secret, algorithms: ['HS256'] }));
        this._express.use(cors({
            origin: 'http://localhost:3000',
            methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
            credentials: true
          }))
        //this._express.use(express.urlencoded({extended:false}))
       // this._express.set("views",path.join(__dirname,"../../public"));
       // this._express.set("view engine", "ejs")
        this._http = new http.Server(this._express);
        this.routes()
      //  this._express.use(session({secret: 'Oh no no no :/s', saveUninitialized: false, resave: false}));
    }


    private routes(){
        this._express.get("/", function(req, res, next) {
            res.send(JSON.stringify(req.cookies));
        });

        this._express.post("/auth/login",async (req,res)=>{
        let login = await Main.databaseService.tryToLogin(String(req.body.username),String(req.body.password));
        if(JSON.parse(login).status === "success"){
        let token = jsonToken.sign({ data:JSON.parse(login).data }, this.secret,{expiresIn:"86400s"});
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

    this._express.get("/auth/check",(req,res,next)=>{
    this.checkAuth(req,res);
    })

    this._express.post("/auth/logout",(req,res,next)=>{
        res.clearCookie("FC_SESSION");
        res.end();
    })

}
    checkAuth(req:express.Request,res:express.Response){
    if(!req.cookies.FC_SESSION){
        res.send(JSON.stringify({status:"failed"}));
        return;
        }

    jsonToken.verify(req.cookies.FC_SESSION,this.secret,(err:any,user:any)=>{
    if(err){
        res.send(JSON.stringify({status:"failed",reason:"Invalid token"})); 
    }else{
    res.send(JSON.stringify({status:"success",token:req.cookies.FC_SESSION}));
    }});
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

}