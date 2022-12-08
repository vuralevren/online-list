import _ from "lodash";
import { all, call, put, select, takeLatest, fork } from "redux-saga/effects";
import listService from "./listService";
import { listActions } from "./listSlice";

function* getListsSaga({
  payload: {
    workspaceSlug,
    isMember,
    searchText,
    isNewSearch,
    onSuccess,
    onFailure,
  },
}) {
  try {
    const info = yield select(({ list }) => list.info);
    const searchedText = yield select(({ list }) => list.searchText);
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const { data: lists, errors } = yield call(listService.getLists, {
        workspaceSlug,
        isMember,
        searchText: isNewSearch ? searchText : searchedText,
        page,
      });
      if (errors) {
        throw errors;
      }
      let newLists = {};

      if (!_.isEmpty(lists?.data)) {
        for (const list of lists?.data) {
          newLists[list.slug] = list;
        }
      }

      if (isNewSearch) {
        yield put(listActions.setSearchText(searchText));
      }
      yield put(
        listActions.setLists({
          newLists,
          page,
        })
      );
      yield put(listActions.setInfo(lists?.info));
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([takeLatest(listActions.getListsRequest.type, getListsSaga)]);
}
