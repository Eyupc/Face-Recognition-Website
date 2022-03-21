import {createClient} from "redis"
export default class RedisClient {
    private static _redis = createClient({url:'redis://0.0.0.0:6379/0'});
    
    constructor(){
     //  this.connect();
    }

    public static  async connect(){
        await RedisClient._redis.connect();
    }
    public static getClient(){
        return this._redis;
    }
    
}