import { NextFunction, Router } from "express";
import { Main } from "../..";
import jsonToken from "jsonwebtoken";
import { HTTPServer } from "../HTTPServer";
import bcrypt from "bcrypt";
import { User } from "../../User/User";
const router = Router();

router.post("/auth/login", async (req, res) => {
  let login = await tryToLogin(
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

async function tryToLogin(username: string, password: string): Promise<string> {
  let data = await Main.databaseService.queryFind({
    collection: "staffs",
    params: { username: { $regex: new RegExp(username, "i") } },
  }); //Case in-sensitive
  if (JSON.parse(data).status === "failed") {
    return JSON.stringify({
      status: "failed",
      reason: "This username doesn't exist!",
    });
  }

  var checkPass = await new Promise(function (resolve, reject) {
    bcrypt.compare(password, JSON.parse(data)[0].password, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  return checkPass
    ? JSON.stringify({
        status: "OK",
        data: new User(
          Number(JSON.parse(data)[0].id),
          JSON.parse(data)[0].username,
          JSON.parse(data)[0].rank
        ),
      })
    : JSON.stringify({ status: "failed", reason: "Incorrect password" });
}
export default router;
