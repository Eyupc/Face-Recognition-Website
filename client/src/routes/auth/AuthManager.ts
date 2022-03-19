import axios from "axios";
import jwtDecode from "jwt-decode";
import { configuration } from "../../configuration";

export class AuthManager {
  public static id = -1;
  public static username = "";
  public static rank = 1;

  public static async checkLoggedIn(): Promise<{ status: boolean; data: any }> {
    // return true if the user is logged in
    let val = { status: false, data: null };
    await axios
      .get(configuration.API_URL + "/auth/check", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((resp) => {
        if (resp.data.status === "OK") {
          val = { status: true, data: resp.data.token };
          let inc: { data: { _id: number; _username: string; _rank: number } } =
            jwtDecode(resp.data.token);
          AuthManager.rank = inc.data._rank;
          AuthManager.username = inc.data._username;
          AuthManager.id = inc.data._id;
        } else {
          //window.location.href = "http://localhost:3000/home"
          val = { status: false, data: null };
        }
      });
    return val;
  }
}
