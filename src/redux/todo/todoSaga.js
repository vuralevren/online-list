import _ from "lodash";
import { all, call, put, select, takeLatest } from "redux-saga/effects";
import todoService from "./todoService";
import { todoActions } from "./todoSlice";

function* getTodosSaga({
  payload: { listSlug, status, searchText, isNewSearch, onSuccess, onFailure },
}) {
  try {
    const info = yield select(({ todo }) => todo.info);
    const searchedText = yield select(({ todo }) => todo.searchText);
    const page = _.isNil(info) || isNewSearch ? 1 : info.currentPage + 1;

    if (isNewSearch || _.isNil(info) || info?.currentPage < info?.totalPages) {
      const { data: todos, errors } = yield call(todoService.getTodoList, {
        listSlug,
        status,
        searchText: isNewSearch ? searchText : searchedText,
        page,
      });
      if (errors) {
        throw errors;
      }
      let newTodos = {};

      if (!_.isEmpty(todos?.data)) {
        for (const todo of todos?.data) {
          newTodos[todo._id] = todo;
        }
      }

      if (isNewSearch) {
        yield put(todoActions.setSearchText(searchText));
      }
      yield put(
        todoActions.setTodos({
          newTodos,
          page,
        })
      );
      yield put(todoActions.setInfo(todos?.info));
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* createTodoSaga({ payload: { body, onSuccess, onFailure } }) {
  try {
    const { data: createdTodo, errors } = yield call(
      todoService.createTodo,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: createdTodo?._id,
        value: createdTodo,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateTodoSaga({ payload: { body, onSuccess, onFailure } }) {
  try {
    const { data: updatedTodo, errors } = yield call(
      todoService.updateTodo,
      body
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: updatedTodo?._id,
        value: updatedTodo,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* updateFieldsTodoSaga({
  payload: { todoId, fields, onSuccess, onFailure },
}) {
  try {
    const { data: updatedTodo, errors } = yield call(
      todoService.updateFieldsTodo,
      todoId,
      fields
    );
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.updateTodos({
        key: updatedTodo?._id,
        value: updatedTodo,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* deleteTodoSaga({ payload: { todoId, onSuccess, onFailure } }) {
  try {
    const { errors } = yield call(todoService.deleteTodo, todoId);
    if (errors) {
      throw errors;
    }

    yield put(
      todoActions.removeTodos({
        key: todoId,
      })
    );

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    console.log(e);
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(todoActions.getTodosRequest.type, getTodosSaga),
    takeLatest(todoActions.createTodoRequest.type, createTodoSaga),
    takeLatest(todoActions.updateTodoRequest.type, updateTodoSaga),
    takeLatest(todoActions.updateFieldsTodoRequest.type, updateFieldsTodoSaga),
    takeLatest(todoActions.deleteTodoRequest.type, deleteTodoSaga),
  ]);
}
