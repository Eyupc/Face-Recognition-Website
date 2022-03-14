import axios from "axios";
import React from "react";
import { configuration } from "../../configuration";
import LoadingPage from "../Loading/LoadingPage";
import NavBar from "../static-parts/NavBar";

export default class DeleteUserPage extends React.Component {
    private data:any;
    state = {
        isLoading:true,
    }

    constructor(props={}){
        super(props);
        this.getData();
    }

    async getData(){
        await axios.get(configuration.API_URL + "/admin/deleteUsers",{headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true}).then((resp)=>{
            this.data  = resp.data;
            //console.log(JSON.parse(this.data[1].train_data).length)
        }).catch((err)=>{
        })
        this.setState({isLoading:false});
    }

    render(){
        if(this.state.isLoading)
        return(<LoadingPage/>)

        return(<div className="flex flex-wrap flex-col justify-center items-center h-screen sm:h-screen">
        <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
                  <NavBar/>
                  <div className="mb-4 p-4">
                    <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                            <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">ID</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Name</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Lastname</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Age</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Images count</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            <tr>
                            <td className="p-2 whitespace-nowrap">
                                    <div className="text-left">1</div>
                                </td>

                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov"/></div>
                                        <div className="font-medium text-gray-800">Alex Shatov</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-left">alexshatov@gmail.com</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-left font-medium text-green-500">$2,890.66</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="text-lg text-center">🇺🇸</div>
                                </td>
                            </tr>
    
                        </tbody>
                    </table>
                </div>
            </div>
        </div></div></div>)
    }

}