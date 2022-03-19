export class User {
    private _id:number;
    private _username:string;
    private _rank:number;
    constructor(id:number,username:string,rank:number){
        this._id = id;
        this._username = username;
        this._rank = rank;
    }

    public get id(){
        return this._id;
    }
    public get username(){
        return this._username;
    }
    public get rank(){
        return this._rank;
    }
}