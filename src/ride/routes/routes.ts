import { Router } from "express";
import { RideController } from "../controller/ride-controller";

const router: Router = Router();

router.post("/request-ride", (req, res) =>
  new RideController().requestRide(req, res)
);

router.get("/get-ride-data/:id", (req, res) =>
  new RideController().getRideData(req, res)
);

export { router };
