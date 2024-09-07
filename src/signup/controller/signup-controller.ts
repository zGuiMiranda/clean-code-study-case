import { STATUSES_CODE } from "../../constants/http/statuses";
import { Account } from "../domain/account.entity";
import { SignupService } from "./../service/signup-service";
import { Request, response, Response } from "express";

export class SignUpController {
  private signupService;
  constructor() {
    this.signupService = new SignupService();
  }

  signup = async (req: Request, res: Response) => {
    const { name, email, password, cpf, carPlate, isDriver, isPassenger } =
      req.body;
    try {
      const response = await this.signupService.signup(
        new Account({
          name,
          email,
          password,
          cpf,
          isDriver,
          isPassenger,
          carPlate,
        })
      );
      res.status(STATUSES_CODE.SUCCESS_CREATION).json(response);
    } catch (error: unknown) {
      res.status(STATUSES_CODE.ERROR).send({ error: (error as Error).message });
    }
  };

  getAccountByEmail = async (req: Request, res: Response) => {
    try {
      const response = await this.signupService.getByEmail(req.params.email);
      res.status(STATUSES_CODE.SUCCESS).json(response);
    } catch (error: unknown) {
      res.status(STATUSES_CODE.ERROR).send({ error: (error as Error).message });
    }
  };
}
