import React from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import LoginPage from "../components/Login/LoginPage";
import HomePage from "../components/Home/HomePage";
import { StreamPage } from "../components/Stream/StreamPage";

export default class AppRoutes extends React.Component {
    constructor(props={}){
        super(props)
    }

    render(){
        return(<BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/home" element={<HomePage/>}/>
            <Route path="/stream" element={<StreamPage/>}/>
            </Routes>
            </BrowserRouter>
        )
    }
}