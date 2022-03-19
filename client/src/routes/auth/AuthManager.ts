import axios from "axios";
import { configuration } from "../../configuration";

export class AuthManager {


public static async checkLoggedIn():Promise<{status:boolean,data:any}>{ // return true if the user is logged in
    let val = {status:false,data:null};
    await axios.get(configuration.API_URL +"/auth/check", {headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true}).then(resp=>{
        if(resp.data.status === "success"){
            val = {status:true,data:resp.data.token};
        }else {

          //window.location.href = "http://localhost:3000/home"
          val = {status:false,data:null};
        }
    })
    return val;
}
}

