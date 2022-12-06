import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  workspaces: {},
  searchText: "",
  info: null, // object
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    getWorkspaceListRequest() {},
    createWorkspaceRequest() {},
    searchWorkspaceListRequest() {},
    getWorkspaceBySlugRequest() {},
    updateWorkspaceRequest() {},
    deleteWorkspaceRequest() {},

    updateWorkspaces(state, action) {
      state.workspaces[action.payload.key] = action.payload.value;
    },
    removeWorkspaces(state, action) {
      delete state.workspaces[action.payload.key];
    },
    setWorkspaces(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.workspaces = {
          ...state.workspaces,
          ...action.payload.newWorkspaces,
        };
      } else {
        state.workspaces = action.payload.newWorkspaces;
      }
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    setSearchText(state, action) {
      state.searchText = action.payload;
    },
  },
});

export const workspaceActions = workspaceSlice.actions;

export default workspaceSlice.reducer;
