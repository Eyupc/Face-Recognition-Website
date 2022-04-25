import { Router } from "express";
import { Main } from "../../../../index";
import { checkAuth } from "../../../AuthManager/Utils";
const router = Router();
router.get("/admin/deleteAdmin", async (req, res, next) => {
  let auth = await checkAuth(req, res, next, false);
  if (JSON.parse(auth).status == "failed") {
    res.send(auth);
    return;
  }
  
  res.send(
    await Main.databaseService.queryFindFilter({
      collection: "staffs",
      params: {id:1,"username":1,rank:1,email:1}
    })
  );
});

export default router;
