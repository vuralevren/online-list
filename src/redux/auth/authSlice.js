import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../../configs/altogic";
import { v4 as uuidv4 } from "uuid";

// Initial state
const initialState = {
  user: auth.getUser(),
  foundUsers: [],
  realtimeKey: uuidv4(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerRequest() {},
    signInRequest() {},
    forgotPasswordRequest() {},
    signInWithTokenRequest() {},
    signOutRequest() {},
    updateUserFieldsRequest() {},
    uploadProfilePictureRequest() {},
    deleteProfilePictureRequest() {},
    changeEmailRequest() {},
    resendVerificationEmailRequest() {},
    changePasswordRequest() {},
    resetPasswordRequest() {},
    updateNameRequest() {},
    isEmailExistRequest() {},
    searchEmailOrNameRequest() {},

    setUser(state, action) {
      state.user = action.payload;
    },
    setFoundUsers(state, action) {
      state.foundUsers = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
