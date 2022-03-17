import mongo, { MongoClient } from "mongodb"
import { User } from "../User/User";
import bcrypt from "bcrypt";
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

    public async queryFind(query:queryParams):Promise<string>{
    let q = await this._database.collection(query.collection).find(query.params).toArray();
    let result = String(JSON.stringify(q));
    if(q.length > 0)
        return result
        else
        return JSON.stringify({status:0})
    }

    public async queryDelete(query:queryParams){
    let result = {status:0}
    let del = this._database.collection(query.collection).deleteOne(query.params);
    if((await del).deletedCount > 0)
        return {status:1};
    else
    return {status:0}
    }

    public async tryToLogin(username:string,password:string):Promise<string>{
        let data = await this.queryFind({collection:"users_admin",params:{username:{$regex:new RegExp(username,"i")}}}) //Case in-sensitive
        if(JSON.parse(data).status === 0){
            return JSON.stringify({status:"failed",reason:"This username doesn't exist!"})
        }
        
        var checkPass = await new Promise(function(resolve, reject) {
        bcrypt.compare(password, JSON.parse(data)[0].password, (err, res) => {
            if (err) {
                reject(err);
           } else {
                resolve(res);
           }
        });
    });

        return (checkPass ? JSON.stringify({status:"success",data:new User(Number(JSON.parse(data)[0].id),JSON.parse(data)[0].username)}):
        JSON.stringify({status:"failed",reason:"Incorrect password"}));
    }
}
