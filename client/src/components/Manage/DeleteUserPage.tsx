import axios from "axios";
import React from "react";
import { configuration } from "../../configuration";
import LoadingPage from "../Loading/LoadingPage";
import NavBar from "../static-parts/NavBar";
import delete_icon from "../../images/delete_icon.png";
import Pagination from '@mui/material/Pagination';

export default class DeleteUserPage extends React.Component {
    private data:any;
    private users:any = [];
    private pagination:any = [];
    private maxPages:number = 1;
    state = {
        isLoading:true,
        currentPage:1,
        items:[],


    }

    constructor(props={}){
        super(props);
        this.getData();
    }
    async getData(){
        await axios.get(configuration.API_URL + "/admin/deleteUsers",{headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true}).then(async(resp)=>{
            this.data  = resp.data;
            this.users = this.data;
            this.maxPages = Math.ceil(this.users.length / 4) + 1; //afronden nr de volgende grootste int
            //console.log(this.maxPages)
            await this.getRows(1);
        }).catch((err)=>{
        })
        this.setState({isLoading:false});
    }

    async getRows(page:number){
        //TODO
        this.setState({items:[]});
        let start = ((page == 1) ? 0 : (page-1)*4);
        for(let i = start; i<= this.users.length-1;i++){
            let info  = this.users[i];
            //console.log(info)
            this.setState({items:[...this.state.items,(<tr key={i}>
                <td className="p-2 whitespace-nowrap">
                        <div className="text-left">{info.id}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3"><img className="rounded-full" src={"data:image/png;base64,"+JSON.parse(info.train_data)[0]} width="40" height="40" alt="Alex Shatov"/></div>
                            <div className="font-medium text-gray-800">{info.name + " " + info.lastname}</div>
                        </div>
                    </td>
        
                    <td className="p-2 whitespace-nowrap">
                        <div className="text-left font-medium text-green-500">{info.age}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                        <div className="text-lg text-center">{JSON.parse(info.train_data).length}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">
                    <button className=" hover:bg-gray-200 text-gray-800 font-bold py-2 px-1 rounded inline-flex items-center" id={"btn-del-"+info.id}>
                    <img draggable={false} src={delete_icon}/>
                    </button>
                    </td>
                </tr>)]});
        }
    }
     private handleChange = async(event: React.ChangeEvent<unknown>, value: number)=>{
        this.setState({currentPage:value})
        await this.getRows(value);
      };



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
                                    <div className="font-semibold text-left">Name & Lastname</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Age</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Images count</div>
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
            <Pagination page={this.state.currentPage} onChange={this.handleChange} count={this.maxPages}/>
  </ul>
            </div></div>
        </div></div></div>)
    }

}