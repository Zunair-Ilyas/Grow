import express from "express";
import { authenticate } from "../middleware/auth";
import { DispatchesService } from "../services/dispatches";

const router = express.Router();
const dispatchesService = new DispatchesService();

// GET /api/v1/dispatches
router.get("/", authenticate, async (req, res, next) => {
  try {
    const dispatches = await dispatchesService.getDispatches();
    res.json({ success: true, data: dispatches });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/dispatches/:id
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const dispatch = await dispatchesService.getDispatchDetail(id);
    res.json({ success: true, data: dispatch });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/dispatches
router.post("/", authenticate, async (req, res, next) => {
  try {
    const dispatch = await dispatchesService.createDispatch(req.body, req.user);
    res.json({ success: true, data: dispatch });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/dispatches/:id/confirm
router.patch("/:id/confirm", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await dispatchesService.confirmDispatch(id, req.user);
    res.json({ success: true, message: "Dispatch confirmed" });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/dispatches/:id/deliver
router.patch("/:id/deliver", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await dispatchesService.markDelivered(id);
    res.json({ success: true, message: "Dispatch marked as delivered" });
  } catch (error) {
    next(error);
  }
});

export default router;
