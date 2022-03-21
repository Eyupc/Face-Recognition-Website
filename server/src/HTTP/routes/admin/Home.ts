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

    let start_time = await Main.databaseService.queryFind({
      collection: "config",
      params: {},
    });
     
    if(JSON.parse(start_time).status == "failed"){
      start_time = "0";
    }else {
      start_time = JSON.parse(start_time)[0].start_time
    }
    let countStaff = await Main.databaseService.countDocuments({collection:"staffs",params:{}})
    let countUser = await Main.databaseService.countDocuments({collection:"users_whitelisted",params:{}})

    return res.send({start_time:start_time,countUser:countUser,countStaff:countStaff});
  });
  export default router;