import { Router } from "express";
import { Main } from "../../..";
import { checkRank, checkAuth, checkUsername } from "../../AuthManager/Utils";
import bcrypt from "bcrypt";
const router = Router();
router.get("/admin/addAdmin", async (req, res, next) => {
  let auth = await checkAuth(req, res, next, false);
  if (JSON.parse(auth).status == "failed") {
    res.send(auth);
    return;
  }

  let checkRankx = await checkRank(req.cookies.FC_SESSION);
  if (!checkRankx) {
    res.send({ status: "failed", reason: "You don't have this permission." });
    return;
  }

  let checkUsernamex = await checkUsername(String(req.query.username));
  if (!checkUsernamex) {
    res.send({ status: "failed", reason: "This username already exist!" });
    return;
  }

  let doc = await Main.databaseService.lastDocument({
    collection: "staffs",
    params: {},
  });
  let lastId = doc[0].id + 1; // +1 last id

  await Main.databaseService.queryInsert({
    collection: "staffs",
    params: {
      id: lastId,
      username: String(req.query.username),
      email: String(req.query.email),
      password: bcrypt.hashSync(String(req.query.password), 12),
      rank: Number(req.query.rank),
    },
  });
  res.send({ status: "OK" });
});
export default router;
