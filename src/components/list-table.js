import _ from "lodash";
import { useState } from "react";
import Button from "./button";
import Input from "./inputs/input";
import CreateTodoModal from "./modals/side-modal";
import TodoSideModal from "./modals/todo-side-modal";
import NewTodoButton from "./new-todo-button";

const list = [
  {
    title: "Comments",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description:
      "Get notified when someones posts a comment on a posting. Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description:
      "Get notified when someones posts a comment on a posting. Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description:
      "Get notified when someones posts a comment on a posting. Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
  {
    title: "Comments",
    description: "Get notified when someones posts a comment on a posting.",
  },
];

export default function TodoList() {
  const [showTodo, setShowTodo] = useState(false);

  return (
    <>
      <fieldset className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="grow">
            <Input autoMargin={false} placeholder="Search Todo" />
          </div>
          <Button
            className="bg-indigo-500 border border-transparent rounded-md py-2.5 px-3 ml-3 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-600"
            onClick={() => setShowTodo(true)}
          >
            New Todo
          </Button>
        </div>
        {_.map(list, (item) => (
          <div className="relative flex items-center">
            <div className="flex items-center h-5">
              <input
                id="comments"
                aria-describedby="comments-description"
                name="comments"
                type="checkbox"
                className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div
              className="ml-3 text-sm sm:hover:bg-indigo-100 w-full p-2 cursor-pointer"
              onClick={() => setShowTodo(true)}
            >
              <label
                htmlFor="comments"
                className="font-medium text-gray-700 cursor-pointer"
              >
                {item.title}
              </label>
              <p id="comments-description" className="text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </fieldset>

      <TodoSideModal show={showTodo} setShow={setShowTodo} />
    </>
  );
}
