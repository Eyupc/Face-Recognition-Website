import { NextFunction, Router } from "express";
import jwt from "jwt-decode";
import jsonToken from "jsonwebtoken"
import { Main } from "../..";
import RedisClient from "../../Redis/RedisClient";
import { HTTPServer } from "../HTTPServer";



type JWTDeCode  = {
    data:{
    _id: number,
    _username:string,
    _rank:number
    }
}

export  async function checkRank(token: string) {
    var info :JWTDeCode = jwt(token);
    //console.log(info)
    if (info.data._rank > 1) {
      return true;
    } else {
      return false;
    }
  }

export async function checkUsername(_username:string){
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

  export async function checkAuth(
    req:any,
    res: any,
    next:NextFunction,
    send: boolean
  ): Promise<any> {
    let returnVal = null;
    if (!req.cookies.FC_SESSION) {
      returnVal = send
        ? res.send(JSON.stringify({ status: "failed" }))
        : JSON.stringify({ status: "failed" });
    }
    var tokens = await RedisClient.getClient().hKeys("tokens");
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
        HTTPServer.secret,
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
