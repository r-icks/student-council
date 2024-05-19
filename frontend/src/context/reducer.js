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
  UPDATE_REQUEST_BEGIN,
  UPDATE_REQUEST_ERROR,
  UPDATE_REQUEST_SUCCESS,
} from "./actions";
import { initialState } from "./appContext";

const reducer = (state, action) => {
  switch (action.type) {
    case LOGOUT_USER:
      return {
        ...initialState,
        userLoading: false,
        user: null,
        userRole: null,
      };
    case GET_CURRENT_USER_BEGIN:
      return {
        ...state,
        userLoading: true,
        showAlert: false,
      };
    case GET_CURRENT_USER_SUCCESS:
      return {
        ...state,
        userLoading: false,
        user: action.payload.user,
        userRole: action.payload.userRole,
      };
    case DISPLAY_ALERT:
      return {
        ...state,
        showAlert: true,
        alertType: action.payload.alertType,
        alertText: action.payload.alertText,
      };
    case CLEAR_ALERT:
      return {
        ...state,
        showAlert: false,
        alertText: "",
        alertType: "",
      };
    case SEND_OTP_BEGIN:
      return {
        ...state,
        otpLoading: true,
      };
    case SEND_OTP_SUCCESS:
      return {
        ...state,
        otpLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "success",
        otpSent: true,
        resendTime: action.payload.resendTime,
      };
    case SEND_OTP_ERROR:
      let otpSent = false;
      if (action.payload.msg === "Wait before sending OTP") {
        otpSent = true;
      }
      return {
        ...state,
        otpLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
        otpSent,
      };
    case LOGIN_BEGIN:
      return {
        ...state,
        otpLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        otpLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "success",
      };
    case LOGIN_ERROR:
      return {
        ...state,
        otpLoading: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };
    case ADD_ACCOUNT_BEGIN:
    case DELETE_ACCOUNT_BEGIN:
    case EDIT_ACCOUNT_BEGIN:
    case UPDATE_PROFILE_BEGIN:
    case GET_ROOMS_BEGIN:
    case REQUEST_ROOM_BEGIN:
    case UPDATE_REQUEST_BEGIN:
      return {
        ...state,
        loading: true,
        loadingOver: true,
      };
    case ADD_ACCOUNT_SUCCESS:
    case DELETE_ACCOUNT_SUCCESS:
    case EDIT_ACCOUNT_SUCCESS:
      return {
        ...state,
        adminAccounts: action.payload.accounts,
        loading: false,
        loadingOver: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "success",
        acconutsLoading: false,
      };
    case UPDATE_PROFILE_SUCCESS:
    case REQUEST_ROOM_SUCCESS:
    case UPDATE_REQUEST_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingOver: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "success",
      };
    case GET_ROOMS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingOver: false,
        buildingAndRoomsData: action.payload.buildingAndRoomsData,
      };
    case GET_ROOMS_ERROR:
    case REQUEST_ROOM_ERROR:
    case UPDATE_PROFILE_ERROR:
    case ADD_ACCOUNT_ERROR:
    case DELETE_ACCOUNT_ERROR:
    case EDIT_ACCOUNT_ERROR:
    case UPDATE_REQUEST_ERROR:
      return {
        ...state,
        loading: false,
        loadingOver: false,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };
    case GET_ALL_ACCOUNTS_BEGIN:
      return {
        ...state,
        accountsLoading: true,
      };
    case GET_ALL_ACCOUNTS_SUCCESS:
      return {
        ...state,
        adminAccounts: action.payload.accounts,
        accountsLoading: false,
      };
    case GET_CLUBS_BEGIN:
      return {
        ...state,
        clubsLoading: true,
      };
    case GET_CLUBS_SUCCESS:
      return {
        ...state,
        clubsLoading: false,
        clubsData: action.payload.clubsData,
      };
    case GET_CLUBS_ERROR:
      return {
        ...state,
        clubsLoading: false,
        clubsData: [],
      };
    default:
      throw new Error(`no such action: ${action.type}`);
  }
};

export default reducer;
