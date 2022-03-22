import axios from "axios";
import React from "react";
import { configuration } from "../../configuration";
import LoadingPage from "../Loading/LoadingPage";
import NavBar from "../static-parts/NavBar";
import delete_icon from "../../images/delete_icon.png";
import Pagination from "@mui/material/Pagination";
import { WSClient } from "../../websocket/WSClient";

export default class DeleteUserPage extends React.Component {
  private users: any = [];
  private maxPages: number = 1; // maximum paginas
  private showCount: number = 0; //hoeveel rijen er zijn = 4 p/pagina

  private WSClient: WSClient;
  private ws: WebSocket;

  state = {
    isLoading: true,
    currentPage: 1,
    items: [],
  };

  constructor(props = {}) {
    super(props);
    this.WSClient = WSClient.getInstance();
    this.WSClient.setPage = "DeleteUserPage";
    this.ws = this.WSClient.websocket;
    this.ws.onmessage = (msg) => this.onMessage(msg);

    this.getData();
  }

  componentDidMount(){
    document.title = "Face Recognition - Delete User"
  }

  onMessage(msg: any) {
    let data = JSON.parse(this.WSClient.decoder.decode(msg.data));
    if (data.header == "DeleteUserEvent") {
      if (data.status == "True") {
        console.log("User deleted");
      } else {
        console.log(data);
      }
    }
  }
  async SendData(json: string) {
    if (this.ws.OPEN === this.ws.readyState)
      this.ws.send(this.WSClient.encoder.encode(json));
    else console.log("ERROR: Websocket connection is closed");
  }

  async getData() {
    await axios
      .get(configuration.API_URL + "/admin/deleteUsers", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(async (resp) => {
        this.users = resp.data;
        this.maxPages =
          this.users.length === undefined
            ? 1
            : Math.ceil(this.users.length / 4); //afronden nr de volgende grootste int
        await this.getRows(this.state.currentPage);
      })
      .catch((err) => {});
    this.setState({ isLoading: false });
  }

  async getRows(page: number) {
    //TODO
    this.setState({ items: [] });
    let start = page == 1 ? 0 : (page - 1) * 4;
    this.showCount = 0;
    for (let i = start; i <= this.users.length - 1; i++) {
      this.showCount++;
      if (this.showCount > 4) break;
      let info = this.users[i];
      this.setState((prevState: any) => ({
        items: [
          ...prevState.items,
          <tr key={i}>
            <td className="p-2 whitespace-nowrap">
              <div className="text-left">{info.id}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
              <div className="flex items-center">
                <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                  <img
                    className="rounded-full"
                    draggable={false}
                    src={
                      "data:image/png;base64," + JSON.parse(info.train_data)[0]
                    }
                    width="40"
                    height="40"
                    alt="Alex Shatov"
                  />
                </div>
                <div className="font-medium text-gray-800">
                  {info.name + " " + info.lastname}
                </div>
              </div>
            </td>

            <td className="p-2 whitespace-nowrap">
              <div className="text-left font-medium text-green-500">
                {info.age}
              </div>
            </td>
            <td className="p-2 whitespace-nowrap">
              <div className="text-lg text-center">
                {JSON.parse(info.train_data).length}
              </div>
            </td>
            <td className="p-2 flex justify-center whitespace-nowrap">
              <button
                onClick={() => this.delete(info.id)}
                className=" hover:bg-gray-200 text-gray-800 font-bold py-2 px-1 rounded inline-flex items-center"
                id={"btn-del-" + info.id}
              >
                <img draggable={false} src={delete_icon} />
              </button>
            </td>
          </tr>,
        ],
      }));
    }
  }
  private handleChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    this.setState({ currentPage: value });
    await this.getRows(value);
  };

  async delete(id: number) {
    await axios
      .get(configuration.API_URL + "/admin/deleteUsers/cmd_delete", {
        params: {
          id: id,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then(async (resp) => {
        // console.log(resp.data.status)
        if (resp.data.status == "OK") {
          if (this.showCount == 1) {
            if (this.state.currentPage != 1) {
              this.setState({ currentPage: this.state.currentPage - 1 });
            }
          }
          await this.getData();
          await this.getRows(this.state.currentPage);
          let json = {
            header: "DeleteUserEvent",
            data: [
              {
                websocket_id: this.WSClient.userId,
                user_id: id,
              },
            ],
          };
          await this.SendData(JSON.stringify(json));
        }
      });
  }

  //TODO WEBSOCKETS
  render() {
    if (this.state.isLoading) return <LoadingPage />;

    return (
      <div className="flex flex-wrap flex-col justify-center items-center h-screen sm:h-screen">
        <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
          <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
              <NavBar />
              <div className="mb-4 p-4">
                <table className="table-auto w-full">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                    <tr>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">ID</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">
                          Name & Lastname
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Age</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">
                          Images count
                        </div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-center">Delete</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {this.state.items}
                  </tbody>
                </table>
              </div>
              <div className="mb-4 p-2 inline-flex justify-center">
                <ul className="inline-flex justify-center items-center -space-x-px">
                  <Pagination
                    page={this.state.currentPage}
                    onChange={this.handleChange}
                    count={this.maxPages}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
