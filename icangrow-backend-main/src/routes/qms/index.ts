import { Router } from "express";
import sopsRouter from "./qms-sops";
import trainingRouter from "./qms-training";
import deviationsRouter from "./qms-deviations";
import capasRouter from "./qms-capas";
import environmentalRouter from "./qms-environmental";
import ebrRouter from "./qms-ebr";

const router: Router = Router();

// Mount all QMS sub-routes
router.use("/sops", sopsRouter);
router.use("/training", trainingRouter);
router.use("/deviations", deviationsRouter);
router.use("/capas", capasRouter);
router.use("/environment", environmentalRouter);
router.use("/ebr", ebrRouter);

export default router;
