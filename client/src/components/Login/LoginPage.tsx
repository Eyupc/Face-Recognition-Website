import React, { SyntheticEvent } from "react";
import "../../css/index.css";
import face_icon1 from "../../images/recognition_1_face.png";
import axios from "axios";
import jwt from "jwt-decode";
import { Navigate } from "react-router-dom";
import login_img from "../../images/login_faces.jpg";
import { configuration } from "../../configuration";
import cogoToast from "cogo-toast";

type UserData = {
  username: string;
  password: string;
  redirect: boolean;
};

export default class LoginPage extends React.Component<{}, UserData> {
  constructor(props = {}) {
    super(props);
    this.state = {
      username: "",
      password: "",
      redirect: false,
    };
  }
  componentDidMount(){
    document.title = "Face Recognition - Login"
  }

  async tryToLogin() {
    await axios
      .post(
        configuration.API_URL + "/auth/login",
        { username: this.state.username, password: this.state.password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((resp) => {
        if (resp.data.status === "OK") {
          const decoded = jwt(resp.data.token);
          cogoToast.success("You are successfully logged in!", {
            position: "top-right",
          });
          this.setState({ redirect: true });
        } else {
          cogoToast.error(resp.data.reason, { position: "top-right" });
        }
      })
      .catch((err) => {
        cogoToast.error("Back-end is offline :(", { position: "top-left" });
      });
  }

  async onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    await this.tryToLogin();
  }

  render() {
    if (this.state.redirect) return <Navigate to="/home" replace />;

    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <form
          onSubmit={async (e) => this.onSubmit(e)}
          method="POST"
          className="box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200 m4 rounded "
        >
          <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-row">
              <div className="h-32 md:h-auto md:w-1/2">
                <img
                  className="object-cover w-full h-full"
                  draggable="false"
                  src={login_img}
                  alt="img"
                />
              </div>
              <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                <div className="w-full">
                  <div className="mb-6">
                    <h2 className="flex justify-center text-2xl font-bold text-center text-gray-700">
                      <img
                        width="32"
                        height="32"
                        src={face_icon1}
                        draggable={false}
                      ></img>
                      &nbsp; Admin Login
                    </h2>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="username" className="text-base font-normal">
                      Username
                    </label>
                    <input
                      onChange={(e) =>
                        this.setState({ username: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      required
                      name="username"
                      placeholder="Your username.."
                      id="username"
                      type="text"
                    ></input>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="text-base font-normal">
                      Password
                    </label>
                    <br />
                    <input
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                      className="w-full px-4 py-2 text-sm border rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      name="password"
                      placeholder="Your password.."
                      id="password"
                      type="password"
                      autoComplete="true"
                      required
                    ></input>
                  </div>
                  <div className="mb-4">
                    <input
                      type="submit"
                      style={{ cursor: "pointer" }}
                      className="w-full bg-blue-200 hover:bg-blue-300 text-white font-bold py-2 px-4 border border-blue-300 rounded"
                      value={"Login"}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
