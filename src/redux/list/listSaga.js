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

function* createListSaga({ payload: { body, onSuccess, onFailure } }) {
  try {
    const { data, errors } = yield call(listService.createList, body);
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.updateLists({
        key: data.slug,
        value: data,
      })
    );
    if (_.isFunction(onSuccess)) onSuccess(data.slug);
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteListSaga({
  payload: { listId, listSlug, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(listService.deleteList, listId);
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.removeLists({
        key: listSlug,
      })
    );
    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateListSaga({
  payload: { body, listSlug, onSuccess, onFailure },
}) {
  try {
    const { data: updatedList, errors } = yield call(
      listService.updateList,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      listActions.removeLists({
        key: listSlug,
      })
    );
    yield put(
      listActions.updateLists({
        key: updatedList.slug,
        value: updatedList,
      })
    );
    if (_.isFunction(onSuccess)) onSuccess(body.slug);
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(listActions.getListsRequest.type, getListsSaga),
    takeLatest(listActions.createListRequest.type, createListSaga),
    takeLatest(listActions.deleteListRequest.type, deleteListSaga),
    takeLatest(listActions.updateListRequest.type, updateListSaga),
  ]);
}
