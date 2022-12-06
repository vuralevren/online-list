import { Popover, Tab } from "@headlessui/react";
import {
  CogIcon,
  PencilAltIcon,
  PlusCircleIcon,
  PlusIcon,
  UserAddIcon,
} from "@heroicons/react/outline";
import cs from "classnames";
import _ from "lodash";
import { useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import Button from "./button";
import AddTeamMembersModal from "./modals/add-team-members-modal";
import ListSideModal from "./modals/list-side-modal";

const tabs = [
  { name: "Shopping", href: "#", count: "52", current: true },
  { name: "Fridge", href: "#", count: "52", current: false },
  { name: "Housework", href: "#", count: "52", current: false },
];

const secondTabs = [
  { name: "Todo", href: "#", count: "52", current: true },
  { name: "Completed", href: "#", count: "52", current: false },
];

export default function Tabs({ settingsOnClick }) {
  return (
    <div className="relative pb-5 sm:pb-0 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="flex items-center text-lg leading-6 font-medium text-gray-900">
          <span class="flex -space-x-2 overflow-hidden">
            <img
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <img
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <img
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
              alt=""
            />
            <img
              class="inline-block h-7 w-7 rounded-full ring-2 ring-white"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </span>
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
            Private
          </span>
        </h3>
        <div className="flex md:mt-0 justify-end">
          <Button onClick={settingsOnClick}>
            <CogIcon
              className="w-6 ml-2 text-indigo-800 cursor-pointer"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Tab.Group
        // onChange={(index) => handleChange(index)}
        // selectedIndex={selectedTabIndex}
        >
          <Tab.List className="flex items-center overflow-auto scrollbar-hide">
            {secondTabs.map((tab, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  cs(
                    "group inline-flex items-center justify-center w-full py-2.5 px-3 text-sm font-medium leading-5 text-slate-700 border-b-2 border-gray-200 whitespace-nowrap",
                    "focus:outline-none",
                    selected
                      ? "text-indigo-700 border-indigo-700"
                      : "text-indigo-400 hover:text-indigo-700 hover:border-indigo-700"
                  )
                }
              >
                <span>{tab.name}</span>
                {tab.count ? (
                  <span
                    className={cs(
                      tab.current
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-indigo-900",
                      "hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
    </div>
  );
}
