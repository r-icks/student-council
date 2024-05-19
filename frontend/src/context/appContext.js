import { useReducer, useContext, useEffect } from "react";
import React from "react";
import reducer from "./reducer";
import axios from "axios";
import {
  ADD_ACCOUNT_BEGIN,
  ADD_ACCOUNT_ERROR,
  ADD_ACCOUNT_SUCCESS,
  CLEAR_ALERT,
  DELETE_ACCOUNT_BEGIN,
  DELETE_ACCOUNT_ERROR,
  DELETE_ACCOUNT_SUCCESS,
  DISPLAY_ALERT,
  EDIT_ACCOUNT_BEGIN,
  EDIT_ACCOUNT_ERROR,
  EDIT_ACCOUNT_SUCCESS,
  GET_ALL_ACCOUNTS_BEGIN,
  GET_ALL_ACCOUNTS_SUCCESS,
  GET_CLUBS_BEGIN,
  GET_CLUBS_ERROR,
  GET_CLUBS_SUCCESS,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  GET_ROOMS_BEGIN,
  GET_ROOMS_ERROR,
  GET_ROOMS_SUCCESS,
  LOGIN_BEGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  REQUEST_ROOM_BEGIN,
  REQUEST_ROOM_ERROR,
  REQUEST_ROOM_SUCCESS,
  SEND_OTP_BEGIN,
  SEND_OTP_ERROR,
  SEND_OTP_SUCCESS,
  UPDATE_PROFILE_BEGIN,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
} from "./actions";

export const initialState = {
  userLoading: true,
  user: null,
  userRole: null,
  showAlert: false,
  alertText: "",
  alertType: "",
  loadingOver: false,
  otpSent: false,
  resendTime: null,
  otpLoading: false,
  accountsLoading: false,
  adminAccounts: null,
  loading: false,
  buildingAndRoomsData: null,
  clubsLoading: true,
  clubsData: null,
};

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
  });

  authFetch.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = ({ alertText, alertType }) => {
    dispatch({ type: DISPLAY_ALERT, payload: { alertText, alertType } });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch("/auth/getCurrentUser");
      const { user } = data;
      const userRole = user.role ?? "club";
      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, userRole } });
    } catch (err) {
      if (err.response.status === 401) return;
      logoutUser();
    }
  };

  const sendOTP = async (email) => {
    dispatch({ type: SEND_OTP_BEGIN });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/otp",
        { email }
      );
      const { msg, resendTime } = response.data;
      dispatch({ type: SEND_OTP_SUCCESS, payload: { resendTime, msg } });
    } catch (error) {
      const errorMessage = error.response.data.msg;
      dispatch({ type: SEND_OTP_ERROR, payload: { msg: errorMessage } });
    }
    clearAlert();
  };

  const login = async (email, otp) => {
    dispatch({ type: LOGIN_BEGIN });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email, otp },
        { withCredentials: true }
      );
      const { msg } = response.data;
      dispatch({ type: LOGIN_SUCCESS, payload: { msg } });
      getCurrentUser();
    } catch (error) {
      const errorMessage = error.response.data.msg;
      dispatch({ type: LOGIN_ERROR, payload: { msg: errorMessage } });
    }
    clearAlert();
  };

  const getAccounts = async () => {
    dispatch({ type: GET_ALL_ACCOUNTS_BEGIN });
    try {
      const response = await authFetch.get("/admin/getAccounts");
      const { allAccounts } = response.data;
      dispatch({
        type: GET_ALL_ACCOUNTS_SUCCESS,
        payload: { accounts: allAccounts },
      });
    } catch (error) {
      console.log(error);
      // logoutUser();
    }
  };

  const addAccount = async (accountData) => {
    dispatch({ type: ADD_ACCOUNT_BEGIN });
    try {
      const response = await authFetch.post("/admin/addAccount", accountData);
      const { msg, allAccounts } = response.data;
      dispatch({
        type: ADD_ACCOUNT_SUCCESS,
        payload: { msg, accounts: allAccounts },
      });
    } catch (error) {
      dispatch({
        type: ADD_ACCOUNT_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const logoutUser = async () => {
    await authFetch.get("/auth/logout");
    dispatch({ type: LOGOUT_USER });
  };

  const editAccount = async (accountData) => {
    dispatch({ type: EDIT_ACCOUNT_BEGIN });
    try {
      const response = await authFetch.post("/admin/editAccount", accountData);
      const { msg, allAccounts } = response.data;
      dispatch({
        type: EDIT_ACCOUNT_SUCCESS,
        payload: { msg, accounts: allAccounts },
      });
    } catch (error) {
      dispatch({
        type: EDIT_ACCOUNT_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteAccount = async (accountData) => {
    dispatch({ type: DELETE_ACCOUNT_BEGIN });
    try {
      const response = await authFetch.post(
        "/admin/deleteAccount",
        accountData
      );
      const { msg, allAccounts } = response.data;
      dispatch({
        type: DELETE_ACCOUNT_SUCCESS,
        payload: { msg, accounts: allAccounts },
      });
    } catch (error) {
      dispatch({
        type: DELETE_ACCOUNT_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const updateProfile = async (updateData) => {
    console.log(updateData);
    dispatch({ type: UPDATE_PROFILE_BEGIN });
    try {
      const response = await authFetch.post("/club/editProfile", updateData);
      const { msg } = response.data;
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: { msg },
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
    // getCurrentUser();
  };

  const getRoomsInfo = async (date) => {
    dispatch({ type: GET_ROOMS_BEGIN });
    try {
      const response = await authFetch.post("/club/room", { date });
      const { msg, buildingAndRoomsData } = response.data;
      dispatch({
        type: GET_ROOMS_SUCCESS,
        payload: { msg, buildingAndRoomsData },
      });
    } catch (error) {
      dispatch({
        type: GET_ROOMS_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const requestRoom = async (data) => {
    dispatch({ type: REQUEST_ROOM_BEGIN });
    try {
      const response = await authFetch.post("/club/request", data);
      const { msg, buildingAndRoomsData } = response.data;
      console.log(msg);
      dispatch({
        type: REQUEST_ROOM_SUCCESS,
        payload: { msg, buildingAndRoomsData },
      });
    } catch (error) {
      dispatch({
        type: REQUEST_ROOM_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  useEffect(() => {
    getCurrentUser();
    getClubsData();
  }, []);

  const findRequestData = async (reqid) => {
    try {
      const response = await authFetch.post("/public/request", {
        requestId: reqid,
      });
      const { roomRequestData } = response.data;
      return roomRequestData;
    } catch (err) {
      displayAlert({ alertText: err.response.data.msg, alertType: "danger" });
      // window.location.href = "/";
    }
  };

  const getClubProfile = async (clubId) => {
    try {
      const response = await authFetch.post("/public/club", {
        clubId,
      });
      const { clubProfile } = response.data;
      return clubProfile;
    } catch (err) {
      displayAlert({ alertText: err.response.data.msg, alertType: "danger" });
      // window.location.href = "/";
    }
  };

  const getClubsData = async () => {
    dispatch({ type: GET_CLUBS_BEGIN });
    try {
      const response = await authFetch.get("/public/clubs");
      const { clubs } = response.data;
      dispatch({
        type: GET_CLUBS_SUCCESS,
        payload: { clubsData: clubs },
      });
    } catch (err) {
      dispatch({
        type: GET_CLUBS_ERROR,
      });
      displayAlert({ alertText: err.response.data.msg, alertType: "danger" });
    }
  };

  const getRequestsData = async () => {
    try {
      const response = await authFetch.get("/public/requests");
      const { roomRequests } = response.data;
      return roomRequests;
    } catch (err) {
      console.log({ debug: err.response.data.msg });
      displayAlert({ alertText: err.response.data.msg, alertType: "danger" });
      window.location.href = "/";
    }
  };

  const updateRoomRequest = async (data) => {
    dispatch({ type: UPDATE_PROFILE_BEGIN });
    try {
      const response = await authFetch.post("/public/update-request", data);
      const { msg } = response.data;
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: { msg },
      });
    } catch (error) {
      dispatch({
        type: UPDATE_PROFILE_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        getCurrentUser,
        sendOTP,
        logoutUser,
        login,
        addAccount,
        getAccounts,
        editAccount,
        updateProfile,
        getRoomsInfo,
        requestRoom,
        findRequestData,
        getRequestsData,
        getClubProfile,
        updateRoomRequest,
        deleteAccount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
