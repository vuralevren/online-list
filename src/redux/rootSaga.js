import { all, fork } from "redux-saga/effects";

import authSaga from "./auth/authSaga";
import workspaceSaga from "./workspace/workspaceSaga";

function* rootSaga() {
  yield all([fork(authSaga), fork(workspaceSaga)]);
}

export default rootSaga;
