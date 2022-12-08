import { auth, db, endpoint } from "../../configs/altogic";

const todoService = {
  getTodoList({ listSlug, status, searchText, page = 1, limit = 12 }) {
    let query = `listSlug == '${listSlug}' && status == '${status}'`;
    if (searchText) {
      query += ` && INCLUDES(TOLOWER(title), TOLOWER('${searchText}'))`;
    }
    return db.model("todos").filter(query).page(page).limit(limit).get(true);
  },
  createTodo(body) {
    return db.model("todos").create(body);
  },
  updateFieldsTodo(todoId, field) {
    return db.model("todos").object(todoId).updateFields(field);
  },
  updateTodo(body) {
    return db.model("todos").object(body?._id).update(body);
  },
  deleteTodo(todoId) {
    return db.model("todos").object(todoId).delete();
  },
};

export default todoService;
