import { Router } from "express";
import { SignUpController } from "../controller/signup-controller";

const router: Router = Router();

router.post("/signup", (req, res) => new SignUpController().signup(req, res));
router.get("/getAccount/:email", (req, res) =>
  new SignUpController().getAccountByEmail(req, res)
);

export { router };
