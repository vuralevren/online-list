import { auth, db, endpoint } from "../../configs/altogic";

const listService = {
  getLists({ workspaceSlug, onlyPublic, searchText, page = 1, limit = 12 }) {
    let query = `workspaceSlug == '${workspaceSlug}'`;
    if (searchText) {
      query += ` && INCLUDES(TOLOWER(workspaceName), TOLOWER('${searchText}'))`;
    }
    if (onlyPublic) {
      query += ` && isPublic`;
    }
    return db.model("lists").filter(query).page(page).limit(limit).get(true);
  },
  createList(body) {
    return db.model("lists").create(body);
  },
  deleteList(listId) {
    return endpoint.delete("/lists", { listId });
  },
  updateList(body) {
    return endpoint.post("/lists", body);
  },
};

export default listService;
