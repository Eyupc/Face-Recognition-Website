import { Router } from "express";
import { Main } from "../../..";
import { checkAuth } from "../../AuthManager/Utils";

const router = Router();

router.get("/admin/home", async (req, res, next) => {
  let auth = await checkAuth(req, res, next, false);
  if (JSON.parse(auth).status == "failed") {
    res.send(auth);
    return;
  }

  let data = await Main.databaseService.queryFind({
    collection: "stats",
    params: {},
  });

  let start_time = 0
  let chartData = {};

  if (JSON.parse(data).status == "failed") {
    start_time = 0;
  } else {
    start_time = JSON.parse(data)[0].start_time;
    chartData = JSON.parse(data)[0].recognized_amount;
  }
  let countStaff = await Main.databaseService.countDocuments({
    collection: "staffs",
    params: {},
  });
  let countUser = await Main.databaseService.countDocuments({
    collection: "users_whitelisted",
    params: {},
  });

  return res.send({
    start_time: start_time,
    countUser: countUser,
    countStaff: countStaff,
    chartData:chartData
  });
});
export default router;
