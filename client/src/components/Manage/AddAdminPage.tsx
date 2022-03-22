import axios from "axios";
import React, { SyntheticEvent } from "react";
import { configuration } from "../../configuration";
import NavBar from "../static-parts/NavBar";

export default class AddAdminPage extends React.Component {
  private err_reason: string = "";
  state = {
    username: "",
    email: "",
    password: "",
    rank: 1,

    user_added_alert: false,
    added: false,
  };

  componentDidMount(){
    document.title = "Face Recognition - Add Admin"
  }
  async AddUser() {
    await axios
      .get(configuration.API_URL + "/admin/addAdmin", {
        params: {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          rank: this.state.rank,
        },

        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(async (resp) => {
        console.log(resp.data);
        if (resp.data.status == "OK") {
          this.setState({
            user_added_alert: true,
            added: true,
          });
        } else {
          this.err_reason = resp.data.reason;

          this.setState({
            user_added_alert: true,
            added: false,
          });
        }
      })
      .catch((err) => {});
  }
  onSubmit(e: SyntheticEvent) {
    e.preventDefault();
    this.AddUser();
  }
  PopUpClose() {
    this.setState({
      user_added_alert: false,
      added: false,
    });
  }

  render() {
    return (
      <form onSubmit={(e) => this.onSubmit(e)}>
        <div className="flex flex-col justify-center items-center h-full xl:h-screen md:h-screen lg:h-screen sm:h-screen">
          <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
              <div className="flex flex-col md:flex-col">
                <NavBar />

                <div className="md:w-auto p-4">
                  {this.state.user_added_alert ? (
                    this.state.added ? (
                      <div className="mb-4">
                        <div
                          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">[OK]</strong>
                          <span className="block sm:inline">
                            The user has been added successfully!
                          </span>
                          <span
                            onClick={() => this.PopUpClose()}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                          >
                            <svg
                              className="fill-current h-6 w-6 text-red-500"
                              role="button"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <title>Close</title>
                              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div
                          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                          role="alert"
                        >
                          <strong className="font-bold">[ERROR]</strong>
                          <span className="block sm:inline">
                            {this.err_reason}
                          </span>
                          <span
                            onClick={() => this.PopUpClose()}
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                          >
                            <svg
                              className="fill-current h-6 w-6 text-red-500"
                              role="button"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <title>Close</title>
                              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    )
                  ) : (
                    <></>
                  )}
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-2/3">
                      <label
                        className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                        htmlFor="Username"
                      >
                        Username:
                      </label>
                      <input
                        onChange={(e) =>
                          this.setState({ username: e.target.value })
                        }
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200"
                        id="username"
                        type="text"
                        name="Username"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-2/3">
                      <label
                        className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                        htmlFor="Email"
                      >
                        Email:
                      </label>
                      <input
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200"
                        id="email"
                        type="email"
                        name="Email"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/2">
                      <label
                        className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                        htmlFor="Password"
                      >
                        Password:
                      </label>
                      <input
                        onChange={(e) =>
                          this.setState({ password: e.target.value })
                        }
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200"
                        id="password"
                        type="password"
                        name="Password"
                        autoComplete="on"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/2">
                      <label
                        className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
                        htmlFor="Rank"
                      >
                        Rank:
                      </label>
                      <input
                        onChange={(e) =>
                          this.setState({ rank: e.target.value })
                        }
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-200"
                        id="rank"
                        type="number"
                        min="1"
                        max="2"
                        name="rank"
                        placeholder="Rank = 1 moderator, 2 = admin"
                        required
                      />
                    </div>
                  </div>

                  <div className="md:flex md:items-center">
                    <div className="md:w-1/6">
                      <input
                        style={{ cursor: "pointer" }}
                        className="w-64 h-10 px-5 m-2 text-blue-100 transition-colors duration-150 bg-blue-400 rounded-lg focus:shadow-outline hover:bg-blue-500"
                        type="submit"
                        value="Voeg toe!"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
