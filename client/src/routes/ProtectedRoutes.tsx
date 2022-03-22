import React, { useEffect, useState } from "react";

import { Navigate, Outlet, useLocation, useRoutes } from "react-router-dom";
import { AuthManager } from "./auth/AuthManager";
import jwt from "jwt-decode";
import LoadingPage from "../components/Loading/LoadingPage";
import { cp } from "fs/promises";

type ProtectedRouteType = {
  auth: true | false;
  rank?: number;
};

const ProtectedRoutes = (props: ProtectedRouteType) => {
  // let {auth,user} =  useAuth()
  let _status: Boolean;
  let _data: any;

  const [loading, setLoading] = useState(true);
  const [user, setUser]: any = useState(null);
  const { pathname } = useLocation();
  useEffect(() => {
    async function check() {
      const { status, data } = await AuthManager.checkLoggedIn();
      _status = status;
      _data = data;
      try {
        setUser(jwt(_data));
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    }
    check();
  }, [pathname]);

  if (loading) return <LoadingPage />;

  if (props.auth) {
    if (user) {
      if (props.rank! <= user.data._rank) {
        return <Outlet />;
      } else {
        return <Navigate to="/home" />;
      }
    } else {
      return <Navigate to="/" />;
    }
  } else {
    if (user) {
      return <Navigate to="/home" />;
    } else {
      return <Outlet />;
    }
  }
};
export default ProtectedRoutes;
