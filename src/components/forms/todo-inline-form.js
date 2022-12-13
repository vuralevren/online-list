import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import useQuery from "../../helpers/useQuery";
import { TodoStatusTypes } from "../../helpers/utils";
import { todoActions } from "../../redux/todo/todoSlice";
import Input from "../inputs/input";

export default function TodoInlineForm({
  create,
  selectedTodo,
  setSelectedTodo,
}) {
  const schema = new yup.ObjectSchema({
    title: yup
      .string()
      .required("Title is required ")
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(40, "title must be at most 40 characters"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { workspaceSlug, listSlug } = useParams();
  const workspace = useSelector(({ workspace }) =>
    _.get(workspace.workspaceList, workspaceSlug)
  );
  const list = useSelector(({ list }) => _.get(list.lists, listSlug));
  const status = useQuery("status");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleEscape, false);

    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, []);

  useEffect(() => {
    if (selectedTodo) setValue("title", selectedTodo?.title);
  }, [selectedTodo]);

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setSelectedTodo(null);
    }
  };

  const onSubmit = ({ title }) => {
    if (!isLoading) {
      setIsLoading(true);
      if (create) createTodo(title);
      else updateTodo(title);
    }
  };

  const createTodo = (title) => {
    const body = {
      listSlug,
      workspace: workspace?._id,
      list: list?._id,
      status: "todo",
      title,
    };
    dispatch(
      todoActions.createTodoRequest({
        body,
        workspaceSlug,
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? status === TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        onSuccess: (slug) => {
          setIsLoading(false);
          setValue("title", "");
          toast.success("Todo created successfully");
        },
        onFailure: (errorList) => {
          setError("title", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
        },
      })
    );
  };

  const updateTodo = (title) => {
    const body = {
      ...selectedTodo,
      title,
    };
    dispatch(
      todoActions.updateTodoRequest({
        body,
        workspaceSlug,
        listSlug,
        status:
          status === TodoStatusTypes.COMPLETED
            ? status === TodoStatusTypes.COMPLETED
            : TodoStatusTypes.TODO,
        onSuccess: (slug) => {
          setIsLoading(false);
          setSelectedTodo(null);
          setIsLoading(false);
          toast.success("Todo updated successfully");
        },
        onFailure: (errorList) => {
          setError("title", {
            type: "manuel",
            message: _.get(errorList, "items[0].message"),
          });
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        id="title"
        name="title"
        className={classNames([
          "flex items-center w-full justify-between px-2 py-2 text-sm font-medium rounded-md border-2",
          create && "border-dashed",
        ])}
        placeholder={create && "Create Todo"}
        autoMargin={false}
        newStyle
        autoFocus={!create}
        register={register("title")}
        error={errors.title}
      />
    </form>
  );
}
