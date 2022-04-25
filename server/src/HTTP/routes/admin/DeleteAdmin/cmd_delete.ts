import { Router } from "express";
import { Main } from "../../../..";
import { checkAuth } from "../../../AuthManager/Utils";

const router = Router();
router.get("/admin/deleteAdmin/cmd_delete", async (req, res, next) => {
  let auth = await checkAuth(req, res, next, false);
  if (JSON.parse(auth).status == "failed") {
    res.send(auth);
    return;
  }
  let del = await Main.databaseService.queryDelete({
    collection: "staffs",
    params: { id: Number(req.query.id) },
  });
  if (del.status == "OK") {
    res.send({ status: "OK" });
  } else {
    res.send({ status: "failed" });
  }
});
export default router;
