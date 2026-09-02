import {
  useDispatch,
  useSelector,
} from "react-redux";

import type { AppDispatch } from "../../../redux/store";

import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../redux/authSelector";

import {
  registerThunk,
  loginThunk,
  logoutThunk,
  getCurrentUserThunk,
} from "../redux/authThunk";

import {
  clearError,
} from "../redux/authSlice";

import type {
  RegisterData,
  LoginData,
} from "../types/authTypes";


const useAuth = () => {

  const dispatch =
    useDispatch<AppDispatch>();


  const user =
    useSelector(selectUser);


  const isAuthenticated =
    useSelector(selectIsAuthenticated);


  const loading =
    useSelector(selectAuthLoading);


  const error =
    useSelector(selectAuthError);


  const register = (
    data: RegisterData
  ) => {
    return dispatch(
      registerThunk(data)
    );
  };


  const login = (
    data: LoginData
  ) => {
    return dispatch(
      loginThunk(data)
    );
  };


  const logout = () => {
    return dispatch(
      logoutThunk()
    );
  };


  const getCurrentUser = () => {
    return dispatch(
      getCurrentUserThunk()
    );
  };


  const handleClearError = () => {
    dispatch(clearError());
  };


  return {
    user,
    isAuthenticated,
    loading,
    error,

    register,
    login,
    logout,
    getCurrentUser,

    clearError: handleClearError,
  };
};


export default useAuth;