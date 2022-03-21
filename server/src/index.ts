import DatabaseService from "./Database/DatabaseService";
import { HTTPServer } from "./HTTP/HTTPServer";
import RedisClient from "./Redis/RedisClient";

export class Main {
  public static http = new HTTPServer("0.0.0.0", 8080);
  public static databaseService = new DatabaseService(
    "0.0.0.0",
    27017,
    "face-recognition"
  );

  constructor() {
    Main.http.Start();
    Main.databaseService.connect();
    RedisClient.connect()
  }
}
var main = new Main();
