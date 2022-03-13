export class User {
    private _id:number;
    private _username:string;
    constructor(id:number,username:string){
        this._id = id;
        this._username = username;
    }

    public get id(){
        return this._id;
    }
    public get username(){
        return this._username;
    }
}