import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  lists: {},
  searchText: "",
  info: null, // object
};

export const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    getListsRequest() {},
    createListRequest() {},
    deleteListRequest() {},
    updateListRequest() {},

    updateLists(state, action) {
      state.lists[action.payload.key] = action.payload.value;
    },
    removeLists(state, action) {
      delete state.lists[action.payload.key];
    },
    setLists(state, action) {
      if (action.payload.page && action.payload.page > 1) {
        state.lists = {
          ...state.lists,
          ...action.payload.newLists,
        };
      } else {
        state.lists = action.payload.newLists;
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

export const listActions = listSlice.actions;

export default listSlice.reducer;
