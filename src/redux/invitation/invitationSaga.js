import _ from "lodash";
import { all, call, takeLatest } from "redux-saga/effects";
import { InvitationEventType } from "../../helpers/useInivitationRealtime";
import realtimeService from "../realtime/realtimeService";
import invitationService from "./invitationService";
import { invitationActions } from "./invitationSlice";

function* sendInvitationSaga({
  payload: { workspaceId, email, onSuccess, onFailure },
}) {
  try {
    const { errors } = yield call(
      invitationService.sendInvitation,
      workspaceId,
      email
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess();
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

function* joinWorkspaceSaga({
  payload: { workspaceId, email, onSuccess, onFailure },
}) {
  try {
    const { data, errors } = yield call(
      invitationService.joinWorkspace,
      workspaceId,
      email
    );
    if (errors) {
      throw errors;
    }

    if (_.isFunction(onSuccess)) onSuccess(data.workspaceSlug);
  } catch (e) {
    if (_.isFunction(onFailure)) onFailure(e);
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(
      invitationActions.sendInvitationRequest.type,
      sendInvitationSaga
    ),
    takeLatest(invitationActions.joinWorkspaceRequest.type, joinWorkspaceSaga),
  ]);
}
