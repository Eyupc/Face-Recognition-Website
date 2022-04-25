import React from "react";
import {
  BrowserRouter,
  NavigateFunction,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
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
import AddAdminPage from "../components/Manage/AddAdminPage";
import DeleteAdminPage from "../components/Manage/DeleteAdminPage";

export default class AppRoutes extends React.Component<{}> {
  constructor(props = {}) {
    super(props);
  }
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoutes auth={false} />}>
            <Route path="/" element={<LoginPage />} />
          </Route>

          <Route path="/" element={<ProtectedRoutes auth={true} rank={1} />}>
            <Route path="/" element={<Outlet />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/stream" element={<StreamPage />} />
            <Route path="/manage/addUser" element={<AddUserPage />} />
            <Route path="/manage/deleteUser" element={<DeleteUserPage />} />
          </Route>

          <Route path="/" element={<ProtectedRoutes auth={true} rank={2} />}>
            <Route path="/manage/addAdmin" element={<AddAdminPage />} />
            <Route path="/manage/deleteAdmin" element={<DeleteAdminPage/>}/>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
