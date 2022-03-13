import React, { useEffect, useState } from "react"

import {Navigate, Outlet, useLocation, useRoutes} from "react-router-dom"
import { AuthManager } from "./auth/AuthManager"
import jwt from "jwt-decode";
import LoadingPage from "../components/Loading/LoadingPage";

type ProtectedRouteType = {
	auth: true | false,
}

const ProtectedRoutes = (props: ProtectedRouteType) => {

   // let {auth,user} =  useAuth()
    let _status:Boolean;
    let _data:any;

    
    const [loading,setLoading] = useState(true);
    const [user,setUser] = useState(null);
   const {pathname} = useLocation();
    useEffect(()=>{
    async function check(){
            const {status,data}= await AuthManager.checkLoggedIn();  
            _status = status;
            _data = data;
                try{
                    setUser(jwt(_data));
                }catch(e){
                setUser(null);
                }
               setLoading(false);     
           }
           check();
           

    },[pathname])


        if(loading)
        return(<LoadingPage/>) //TODO

		return(
            props.auth ? (
			user ? (
				<Outlet />
			) : (
				<Navigate to="/" />
			)
		) : (
			user ? (<Navigate to='/home'/>): <Outlet/>
		));
    
}
export default ProtectedRoutes