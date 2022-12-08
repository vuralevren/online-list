import { Menu, Transition } from "@headlessui/react";
import { CogIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/button";
import Input from "../components/inputs/input";
import Navbar from "../components/navbar";
import Modal from "../components/modals/modal";
import NewWorkspaceForm from "../components/forms/new-workspace-form";
import { useDispatch, useSelector } from "react-redux";
import { workspaceActions } from "../redux/workspace/workspaceSlice";
import _ from "lodash";
import useArraySelector from "../helpers/useArraySelector";
import { myRouter } from "../helpers/routes";
import AvatarList from "../components/avatar-list";
import AccessBadge from "../components/access-badge";
import ListObserver from "../components/list-observer";
import Empty from "../components/empty";

export default function Workspace() {
  const dispatch = useDispatch();

  const workspaceList = useArraySelector(
    ({ workspace }) => workspace.workspaces
  );
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!_.isEmpty(workspaceList)) {
      getWorkspaceList("", true);
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(workspaceActions.setInfo(null));
    };
  }, []);

  const getWorkspaceList = (searchText, isNewSearch = false) => {
    dispatch(
      workspaceActions.getWorkspaceListRequest({
        searchText: searchText || isNewSearch ? searchText.trim() : null,
        isNewSearch,
      })
    );
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(_.trim(value));

    if (_.size(value) > 2) {
      _.debounce(() => {
        getWorkspaceList(value, true);
      }, 500)();
    } else if (_.size(value) === 0) {
      getWorkspaceList("", true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-indigo-900 sm:text-4xl">
              Select Workspace
            </h2>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="grow">
              <Input
                autoMargin={false}
                placeholder="Search Workspace"
                onChange={handleSearch}
                value={searchText}
              />
            </div>
            <Button
              className="bg-indigo-500 border border-transparent rounded-md py-2.5 px-3 ml-3 flex items-center justify-center text-xs md:text-sm font-medium text-white hover:bg-indigo-600"
              onClick={() => setShowNewWorkspace(true)}
            >
              New Workspace
            </Button>
          </div>
          <ListObserver onEnd={getWorkspaceList}>
            <div className="mt-6 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              {_.map(workspaceList, (workspaceObj) => (
                <div
                  key={workspaceObj.workspaceSlug}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden h-[300px]"
                >
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <Link to={myRouter.HOME(workspaceObj.workspaceSlug)}>
                      <div className="flex-1">
                        <div className="block mt-2">
                          <p className="text-xl font-semibold text-gray-900">
                            <span className="mr-2">
                              <AccessBadge
                                isPublic={workspaceObj.workspace.isPublic}
                              />
                            </span>
                            {workspaceObj.workspace.name}
                          </p>
                          <p className="mt-3 text-base text-gray-500">
                            {workspaceObj.workspace.description ||
                              "No Description."}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center">
                        <AvatarList
                          users={workspaceObj.workspace.userProfilePictures}
                          totalSize={workspaceObj.workspace.userSize}
                        />
                        {workspaceObj.isOwner && (
                          <div className="ml-2">
                            <span className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-yellow-600">
                              Owner
                            </span>
                          </div>
                        )}
                      </div>
                      {workspaceObj.isOwner && (
                        <Link
                          to={myRouter.SETTINGS_WORKSPACE(
                            workspaceObj.workspaceSlug
                          )}
                        >
                          <CogIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ListObserver>
        </div>
      </div>

      <Modal show={showNewWorkspace} setShow={setShowNewWorkspace}>
        <NewWorkspaceForm />
      </Modal>
    </>
  );
}
