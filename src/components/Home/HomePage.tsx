import React from "react";
import "../../css/index.css"
import NavBar from "../static-parts/NavBar";
import { StatsCard } from "./parts/StatsCard";
export default class HomePage extends React.Component{

    constructor(props ={}){
        super(props);
    }

    render(){
        return(<div className="flex flex-col justify-center items-center h-screen">
        <div className="box-border h-72 w-auto h-auto p-4 border-4 bg-slate-200	-500 m4 rounded ">
            <div className="flex-1 h-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="flex flex-col md:flex-col">
            <div className="mb-6">
                  <NavBar/>
            </div>
            <div className="mb-4 p-4">
                  <StatsCard/>
                  </div>
                    </div>
                    </div>
                    </div>
                    </div>
        )
    }
}