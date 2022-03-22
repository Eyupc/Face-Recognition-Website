import { Router } from "express";
import { Main } from "../../../../index";
import { checkAuth } from "../../../AuthManager/Utils";

const router = Router();
router.get("/admin/deleteUsers", async (req, res, next) => {
  let auth = await checkAuth(req, res, next, false);
  if (JSON.parse(auth).status == "failed") {
    res.send(auth);
    return;
  }
  res.send(
    await Main.databaseService.queryFind({
      collection: "users_whitelisted",
      params: {},
    })
  );
});

export default router;
