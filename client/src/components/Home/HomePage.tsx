import React from "react";
import "../../css/index.css"
import { AuthManager } from "../../routes/auth/AuthManager";
import LoginPage from "../Login/LoginPage";
import NavBar from "../static-parts/NavBar";
import { StatsCard } from "./parts/StatsCard";
import StatsChart from "./parts/StatsChart";
export default class HomePage extends React.Component{

    state = {
        loggedIn:true,
        isLoading:true,
    }
     constructor(props ={}){
        super(props);
    }


    render(){

        return(<div className="flex flex-col justify-center items-center xl:h-screen md:h-full lg:h-full">
        <div className="md:flex box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
                  <NavBar/>
            <div className="mb-4 p-4">
                  <StatsCard/>
                  </div>
            <StatsChart/>
                    </div>
                    </div>
                    </div>
                    </div>
        )
    }
}