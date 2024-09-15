import { Request, Response } from "express";
import { PGConnection } from "../../database/pg-connection";
import { RideRepository } from "../repository/ride-repository";
import { STATUSES_CODE } from "../../constants/http/statuses";
import { AccountRepository } from "../../account/repository/account-repository";
import RequestRide from "../use-cases/request-ride";
import GetRideData from "../use-cases/get-ride-data";

export class RideController {
  private requestRideUseCase;
  private getRideDataUseCase;

  constructor() {
    this.requestRideUseCase = new RequestRide(
      new RideRepository(PGConnection.getInstance()),
      new AccountRepository(PGConnection.getInstance())
    );
    this.getRideDataUseCase = new GetRideData(
      new RideRepository(PGConnection.getInstance())
    );
  }

  requestRide = async (req: Request, res: Response) => {
    try {
      const response = await this.requestRideUseCase.execute(req.body);
      res.status(STATUSES_CODE.SUCCESS_CREATION).json(response);
    } catch (error: unknown) {
      res.status(STATUSES_CODE.ERROR).send({ error: (error as Error).message });
    }
  };

  getRideData = async (req: Request, res: Response) => {
    try {
      const response = await this.getRideDataUseCase.execute({
        id: req.params.id,
      });
      res.status(STATUSES_CODE.SUCCESS_CREATION).json(response);
    } catch (error: unknown) {
      res.status(STATUSES_CODE.ERROR).send({ error: (error as Error).message });
    }
  };
}
