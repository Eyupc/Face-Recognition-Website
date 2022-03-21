import { Router } from "express";
import RedisClient from "../../../Redis/RedisClient";

const router = Router()
router.post("/auth/logout", async (req, res, next) => {
if (req.cookies.FC_SESSION) {
    await RedisClient.getClient().hSet(
      "tokens",
      req.cookies.FC_SESSION.toString()
    );
    res.clearCookie("FC_SESSION");
    res.end();
  }
});
export default router;