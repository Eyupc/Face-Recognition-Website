import React from "react";
import {BrowserRouter,NavigateFunction,Outlet,Route,Routes} from "react-router-dom";
import LoginPage from "../components/Login/LoginPage";
import HomePage from "../components/Home/HomePage";
import { StreamPage } from "../components/Stream/StreamPage";
import { AddUserPage } from "../components/Manage/AddUserPage";
import axios from "axios";
import { AuthManager } from "./auth/AuthManager";
import ProtectedRoutes from "./ProtectedRoutes";
import { ErrorPage } from "../components/Error/ErrorPage";
import LoadingPage from "../components/Loading/LoadingPage";
import DeleteUserPage from "../components/Manage/DeleteUserPage";



type Auth = {
    isAuth:boolean,
    isLoading:boolean,

}
export default class AppRoutes extends React.Component<{},Auth> {
    constructor(props={}){
        super(props)
        this.state = {isAuth:false,isLoading:true}
    }
 
    componentWillUnmount(){
        console.log("ok")
    }
    render(){
        return(<BrowserRouter>
        <Routes>

            <Route path="/"  element={<ProtectedRoutes auth={false} />}> 
            <Route path="/" element={<LoginPage/>}/> 
            </Route>

            <Route path="/" element={<ProtectedRoutes auth={true} />}>  
			        <Route path="/" element={<Outlet />}/>
                    <Route path="/home" element={<HomePage />} /><Route path="/stream" element={<StreamPage />} />
                    <Route path="/manage/add" element={<AddUserPage />} />
                    <Route path="/manage/delete" element= {<DeleteUserPage/>}/>
            </Route>
            <Route path='*' element={<ErrorPage/>} />
            </Routes>
            </BrowserRouter>
        )
    }
}
