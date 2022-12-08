import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import useArraySelector from "../helpers/useArraySelector";
import useQuery from "../helpers/useQuery";
import { TodoStatusTypes } from "../helpers/utils";
import { todoActions } from "../redux/todo/todoSlice";
import Button from "./button";
import Input from "./inputs/input";
import ListObserver from "./list-observer";
import TodoSideModal from "./modals/todo-side-modal";

export default function TodoList() {
  const status = useQuery("status");
  const { listSlug } = useParams();
  const dispatch = useDispatch();
  const todoList = useArraySelector(({ todo }) => todo.todos);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const selectedStatus =
    status !== TodoStatusTypes.COMPLETED
      ? TodoStatusTypes.TODO
      : TodoStatusTypes.COMPLETED;

  useEffect(() => {
    return () => {
      dispatch(todoActions.setInfo(null));
    };
  }, []);

  const getTodoList = (searchText, isNewSearch = false) => {
    dispatch(
      todoActions.getTodosRequest({
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
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
        getTodoList(value, true);
      }, 500)();
    } else if (_.size(value) === 0) {
      getTodoList("", true);
    }
  };

  const changeStatusTodo = (todoId, currentStatus) => {
    setIsLoadingStatus(true);
    dispatch(
      todoActions.updateFieldsTodoRequest({
        todoId,
        fields: {
          field: "status",
          updateType: "set",
          value:
            currentStatus === TodoStatusTypes.TODO
              ? TodoStatusTypes.COMPLETED
              : TodoStatusTypes.TODO,
        },
        onSuccess: () => setIsLoadingStatus(false),
        onFailure: () => setIsLoadingStatus(false),
      })
    );
  };

  return (
    <>
      <fieldset className="space-y-5">
        <div className="flex justify-between items-center">
          <div className="grow">
            <Input
              autoMargin={false}
              placeholder="Search Todo"
              onChange={handleSearch}
              value={searchText}
            />
          </div>
          <Button
            className="bg-indigo-500 border border-transparent rounded-md py-2.5 px-3 ml-3 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-600"
            onClick={() => setSelectedTodo(true)}
          >
            New Todo
          </Button>
        </div>
        <ListObserver onEnd={getTodoList}>
          {_(todoList)
            .filter((todo) => todo.status === selectedStatus)
            .valueOf()
            .map((todo) => (
              <div key={todo._id} className="relative flex items-center">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    onChange={() => changeStatusTodo(todo?._id, todo?.status)}
                    checked={todo?.status === TodoStatusTypes.COMPLETED}
                    disabled={isLoadingStatus}
                  />
                </div>
                <div
                  className="ml-3 text-sm sm:hover:bg-indigo-100 w-full p-2 cursor-pointer"
                  onClick={() => setSelectedTodo(todo)}
                >
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-700 cursor-pointer"
                  >
                    {todo.title}
                  </label>
                  <p id="comments-description" className="text-gray-500">
                    {todo.description}
                  </p>
                </div>
              </div>
            ))}
        </ListObserver>
      </fieldset>

      <TodoSideModal
        selectedTodo={selectedTodo}
        setSelectedTodo={setSelectedTodo}
      />
    </>
  );
}
