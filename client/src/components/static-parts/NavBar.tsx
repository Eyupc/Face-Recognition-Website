import React from "react";
import "../../css/index.css";
import icon from "../../images/recognition_2_face.png";
import "flowbite";
import {
  NavLink,
  HistoryRouterProps,
  Outlet,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { configuration } from "../../configuration";
import Dropdown from "react-dropdown";
import { AuthManager } from "../../routes/auth/AuthManager";

type Props = {
  showNav: boolean;
  logout: boolean;
};
export default class NavBar extends React.Component<{}, Props> {
  constructor(props: Props) {
    super(props);
    this.state = { showNav: false, logout: false };
    this.toggleNav = this.toggleNav.bind(this);
  }

  toggleNav() {
    this.setState({
      showNav: !this.state.showNav,
    });
  }

  async logout() {
    await axios.post(
      configuration.API_URL + "/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    this.setState({ logout: true });
  }

  render() {
    if (this.state.logout) {
      return <Navigate to="/" />;
    }
    return (
      <nav className="bg-blue-200 border-gray-200 px-2 rounded p-2">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <a href="#" className="flex">
            <img draggable={false} src={icon} />
            <span className="self-center text-lg font-semibold whitespace-nowrap">
              Face Recognition
            </span>
          </a>
          <button
            onClick={this.toggleNav}
            type="button"
            id="btn-logout"
            className="md:hidden ml-3 text-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg inline-flex items-center justify-center"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={
              (this.state.showNav ? "collapse navbar-collapse" : "") +
              "hidden md:block w-full md:w-auto p-4"
            }
          >
            <ul className="flex-col md:flex-row flex md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    (isActive
                      ? "md:text-blue-700 bg-blue-700"
                      : "md:hover:text-cyan-700  bg-[#adc9eb]") +
                    " md:bg-transparent  block pl-3 pr-4 py-2 md:p-0 rounded"
                  }
                  to="/home"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    (isActive
                      ? "md:text-blue-700 bg-blue-700"
                      : "md:hover:text-cyan-700 0 bg-[#adc9eb]") +
                    " md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                  }
                  to="/stream"
                  end
                >
                  Stream
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    (isActive
                      ? "md:text-blue-700 bg-blue-700"
                      : "md:hover:text-cyan-700 0 bg-[#adc9eb]") +
                    " md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                  }
                  to="/manage/addUser"
                  end
                >
                  Add user
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink
                  className={({ isActive }) =>
                    (isActive
                      ? "md:text-blue-700 bg-blue-700"
                      : "md:hover:text-cyan-700 0 bg-[#adc9eb]") +
                    " md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                  }
                  to="/manage/deleteUser"
                  end
                >
                  Delete user
                </NavLink>
              </li>
              {AuthManager.rank > 1 ? ( // check if rank is greater than 1
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      (isActive
                        ? "md:text-blue-700 bg-blue-700"
                        : "md:hover:text-cyan-700 0 bg-[#adc9eb]") +
                      " md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                    }
                    to="/manage/addAdmin"
                    end
                  >
                    Add admin
                  </NavLink>
                </li>
              ) : (
                <></>
              )}

        {AuthManager.rank > 1 ? ( // check if rank is greater than 1
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      (isActive
                        ? "md:text-blue-700 bg-blue-700"
                        : "md:hover:text-cyan-700 0 bg-[#adc9eb]") +
                      " md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                    }
                    to="/manage/deleteAdmin"
                    end
                  >
                    Delete admin
                  </NavLink>
                </li>
              ) : (
                <></>
              )}

              <li>
                <NavLink
                  onClick={() => this.logout()}
                  className={
                    "md:text-orange-800 bg-[#adc9eb] md:bg-transparent block pl-3 pr-4 py-2 md:p-0 rounded"
                  }
                  to=""
                  end
                >
                  Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
