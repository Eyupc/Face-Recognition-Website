import {createClient} from "redis"
export default class RedisClient {
    private _redis = createClient({url:'redis://0.0.0.0:6379/0'});
    
    constructor(){
        this.connect();
    }

    private async connect(){
        await this._redis.connect();
    }
    public  getClient(){
        return this._redis;
    }
    
}