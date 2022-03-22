import { Router } from "express";
import { checkAuth } from "../../AuthManager/Utils";
const router = Router();

router.get("/auth/check", async (req, res, next) => {
  await checkAuth(req, res, next, true);
});
export default router;
