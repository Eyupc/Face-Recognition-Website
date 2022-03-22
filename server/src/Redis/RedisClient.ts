import { createClient } from "redis";
export default class RedisClient {
  private static _redis = createClient({ url: "redis://0.0.0.0:6379/0" });

  constructor() {}

  public static async connect() {
    await RedisClient._redis.connect();
  }
  public static getClient() {
    return this._redis;
  }
}
/*
Redis is being used to blacklist tokens. 
When someone logged off, and the token is not expired.
*/
