import { Router } from "express";
import auditManagementRouter from "./audit-management";

const router: Router = Router();

// Mount all audit sub-routes
router.use("/", auditManagementRouter);

export default router;
