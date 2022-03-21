import { NextFunction, Router } from "express";
import { Main } from "../..";
import jsonToken from "jsonwebtoken"
import { HTTPServer } from "../HTTPServer";

const router = Router();


router.post("/auth/login", async (req, res) => {
    let login = await Main.databaseService.tryToLogin(
      String(req.body.username),
      String(req.body.password)
    );
    if (JSON.parse(login).status === "OK") {
      let token = jsonToken.sign(
        { data: JSON.parse(login).data },
        HTTPServer.secret,
        { expiresIn: "120m" }
      );
      res.cookie("FC_SESSION", token, {
        expires: new Date(new Date().setHours(new Date().getHours() + 1)),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.send({
        status: "OK",
        token: token,
      });
    } else {
      res.send(JSON.parse(login));
    }
  });
export default router;