import { configureStore } from "@reduxjs/toolkit";

import authReducer
  from "../features/auth/redux/authSlice";

import staffManagementReducer
  from "../features/admin/Stfaff Managment/redux/staffManagmentSlice";

import studentManagementReducer
  from "../features/admin/StudentManagment/redux/studentManagmentSlice";

import communicationReducer
  from "../features/admin/Comunication/redux/communicationSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    staffManagement: staffManagementReducer,
    studentManagement: studentManagementReducer,
    communication: communicationReducer,
  },
});


export type RootState =
  ReturnType<typeof store.getState>;


export type AppDispatch =
  typeof store.dispatch;