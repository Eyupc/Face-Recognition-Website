import mongo, { MongoClient } from "mongodb"
import { User } from "../User/User";

type queryParams = {
    collection:string,
    params:{}
}
export default class DatabaseService {
    private _client:MongoClient;
    private _database:mongo.Db;

    constructor(host:string,port:number,database:string){
        this._client = new MongoClient("mongodb://"+host+":"+port.toString());
        this._database = this._client.db(database)
    }
    
    public connect(){
        this._client.connect()
    }

    public async query(query:queryParams):Promise<string>{
    let q = await this._database.collection(query.collection).find(query.params).toArray();
    let result = String(JSON.stringify(q));
    if(q.length > 0)
        return result
        else
        return JSON.stringify({status:0})
    }

    public async tryToLogin(username:string,password:string):Promise<string>{
        let checkUsername = await this.query({collection:"staffs",params:{username:{$regex:new RegExp(username,"i")}}}) //Case in-sensitive
        if(JSON.parse(checkUsername).status === 0){
            return JSON.stringify({status:"failed",reason:"This username doesn't exist!"})
        }
        let checkCredentials = await this.query({collection:"staffs",params:{username:{$regex:new RegExp(username,"i")},password:password}})
        if(JSON.parse(checkCredentials).status === 0){
            return JSON.stringify({status:"failed",reason:"Incorrect password"})
        }
        return JSON.stringify({status:"success",data:new User(Number(JSON.parse(checkCredentials)[0].id),JSON.parse(checkCredentials)[0].username)})
    }
}
