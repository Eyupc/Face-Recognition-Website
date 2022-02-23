import React from "react";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import LoginPage from "../components/Login/LoginPage";
import HomePage from "../components/Home/HomePage";
import { StreamPage } from "../components/Stream/StreamPage";
import { AddUserPage } from "../components/Manage/AddUserPage";

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
            <Route path="/manage/add" element={<AddUserPage/>}/>

            </Routes>
            </BrowserRouter>
        )
    }
}