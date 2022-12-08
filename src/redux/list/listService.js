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
};

export default listService;
