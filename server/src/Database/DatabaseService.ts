import mongo, { Collection, InsertOneResult, MongoClient } from "mongodb";
import { User } from "../User/User";
import bcrypt from "bcrypt";
type queryParams = {
  collection: string;
  params: {};
};
export default class DatabaseService {
  private _client: MongoClient;
  private _database: mongo.Db;

  constructor(host: string, port: number, database: string) {
    this._client = new MongoClient("mongodb://" + host + ":" + port.toString());
    this._database = this._client.db(database);
  }

  public connect() {
    this._client.connect();
  }

  public async queryFind(query: queryParams): Promise<string> {
    let q = await this._database
      .collection(query.collection)
      .find(query.params)
      .toArray();
    let result = String(JSON.stringify(q));
    if (q.length > 0) return result;
    else return JSON.stringify({ status: "failed" });
  }
  public async queryFindFilter(query: queryParams): Promise<string> {
    let q = await this._database
      .collection(query.collection)
      .find({}) //TODO
      .toArray();
    let result = String(JSON.stringify(q));
    if (q.length > 0) return result;
    else return JSON.stringify({ status: "failed" });
  }

  public async lastDocument(
    query: queryParams
  ): Promise<mongo.WithId<mongo.Document>[]> {
    let lastrecord = this._database
      .collection(query.collection)
      .find({})
      .sort("_id", -1)
      .limit(1)
      .toArray();
    return lastrecord;
  }

  public async queryDelete(query: queryParams): Promise<{ status: string }> {
    let del = this._database
      .collection(query.collection)
      .deleteOne(query.params);
    if ((await del).deletedCount > 0) return { status: "OK" };
    else return { status: "failed" };
  }

  public async queryInsert(
    query: queryParams
  ): Promise<InsertOneResult<Document>> {
    return await this._database
      .collection(query.collection)
      .insertOne(query.params);
  }
  public async countDocuments(query: queryParams): Promise<number> {
    return await this._database.collection(query.collection).countDocuments();
  }
}
