import axios from "axios";
import React from "react";
import { configuration } from "../../../configuration";

export class StatsCard extends React.Component {
  private start_time: number = 0;
  private timer: any;
  private loading = true;

  state = {
    runtime: 0,
    countUser: 0,
    countStaff: 0,
  };
  constructor(props = {}) {
    super(props);
  }
  async componentDidMount() {
    this.loading = false;
    await this.getData();

    if (this.start_time !== 0) {
      this.timer = setInterval(() => {
        // renders again => clock will work
        this.setState({
          runtime: Math.round(
            (Number(Math.round(Date.now() / 1000)) -
              Number(Math.round(this.start_time))) /
              60
          ),
        });
      }, 1000);
    }
  }

  componentWillUnmount() {
    this.loading = true;
    clearTimeout(this.timer);
  }

  async getData() {
    await axios
      .get(configuration.API_URL + "/admin/home", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(async (resp) => {
        // console.log(resp.data)
        if (!this.loading) {
          this.start_time = await resp.data.start_time;
          if (this.start_time !== 0) {
            this.setState({
              runtime: Math.round(
                (Number(Math.round(Date.now() / 1000)) -
                  Number(Math.round(this.start_time))) /
                  60
              ),
              countUser: resp.data.countUser,
              countStaff: resp.data.countStaff,
            });
          }
        }
      });
  }

  render(): React.ReactNode {
    return (
      <>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-5 bg-white rounded shadow-xl">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-fuchsia-50 text-fuchsia-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.3333 9.33334H28M28 9.33334V20M28 9.33334L17.3333 20L12 14.6667L4 22.6667"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-gray-400">Runtime</div>
                <div className="text-2xl font-bold text-gray-900">
                  {this.state.runtime}min.
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white rounded shadow-xl">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-50 text-cyan-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.52325 6.61231C10.2911 5.20443 12.4206 4.32434 14.6667 4.07333V17.3333H27.9267C27.6757 19.5794 26.7956 21.7089 25.3877 23.4767C23.9798 25.2446 22.1013 26.5791 19.9685 27.3265C17.8357 28.0739 15.5351 28.2039 13.3317 27.7015C11.1282 27.1991 9.11142 26.0847 7.51336 24.4866C5.91529 22.8886 4.80094 20.8718 4.29854 18.6683C3.79614 16.4649 3.92612 14.1643 4.67352 12.0315C5.42092 9.89866 6.75535 8.0202 8.52325 6.61231Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M20 12H27.3173C26.7188 10.3128 25.7513 8.78047 24.4854 7.5146C23.2195 6.24873 21.6872 5.28125 20 4.68268V12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-gray-400">Users</div>
                <div className="text-2xl font-bold text-gray-900">
                  {this.state.countUser}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white rounded shadow-xl">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-400">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.7712 13.1046C20.7714 12.1044 21.3333 10.7478 21.3333 9.33333C21.3333 7.91885 20.7714 6.56229 19.7712 5.5621C18.771 4.5619 17.4145 4 16 4C14.5855 4 13.2289 4.5619 12.2288 5.5621C11.2286 6.56229 10.6667 7.91885 10.6667 9.33333C10.6667 10.7478 11.2286 12.1044 12.2288 13.1046C13.2289 14.1048 14.5855 14.6667 16 14.6667C17.4145 14.6667 18.771 14.1048 19.7712 13.1046Z"
                      stroke="#FBBF24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M9.40033 21.4003C11.1507 19.65 13.5246 18.6667 16 18.6667C18.4753 18.6667 20.8493 19.65 22.5997 21.4003C24.35 23.1507 25.3333 25.5246 25.3333 28H6.66666C6.66666 25.5246 7.64999 23.1507 9.40033 21.4003Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-gray-400">Staffs</div>
                <div className="text-2xl font-bold text-gray-900">
                  {this.state.countStaff}
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 bg-white rounded shadow-xl">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-gray-400">Clock</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(new Date().getHours().toString().length > 1
                    ? new Date().getHours()
                    : "0" + new Date().getHours()) +
                    ":" +
                    (new Date().getMinutes().toString().length > 1
                      ? new Date().getMinutes()
                      : "0" + new Date().getMinutes()) +
                    ":" +
                    (new Date().getSeconds().toString().length > 1
                      ? new Date().getSeconds()
                      : "0" + new Date().getSeconds())}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
