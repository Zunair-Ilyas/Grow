import express from "express";
import { PurchaseOrdersService } from "../services/purchase_orders";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// GET /api/v1/purchase-orders - List purchase orders with optional filters
router.get("/", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const filters = {
      searchTerm: req.query.searchTerm as string,
      status: req.query.status as string,
      supplier_id: req.query.supplier_id as string,
      priority: req.query.priority as string,
    };
    const pos = await service.getPurchaseOrders(filters);
    res.status(200).json({ success: true, data: pos });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/purchase-orders/:id - Get PO details (with supplier info)
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const po = await service.getPurchaseOrderById(req.params.id);
    res.status(200).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/purchase-orders/:id/items - Get PO items
router.get("/:id/items", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const items = await service.getPurchaseOrderItems(req.params.id);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/purchase-orders - Create PO (with items)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const created_by = req.user?.userId;
    const { po, items } = req.body; // Expect { po: {...}, items: [...] }
    if (!po || !items || !Array.isArray(items)) {
      res.status(400).json({ success: false, error: "Missing PO or items data" });
      return;
    }
    const newPO = await service.createPurchaseOrder({ ...po, created_by }, items);
    res.status(201).json({ success: true, data: newPO });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// PATCH /api/v1/purchase-orders/:id - Update PO
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const po = await service.updatePurchaseOrder(req.params.id, req.body);
    res.status(200).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/purchase-orders/:id/approve - Approve PO
router.patch("/:id/approve", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const approved_by = req.user?.userId;
    if (!approved_by) {
      res.status(400).json({ success: false, error: "Missing approved_by user ID" });
      return;
    }
    const po = await service.approvePurchaseOrder(req.params.id, approved_by);
    res.status(200).json({ success: true, data: po });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// PATCH /api/v1/purchase-orders/:id/deliver - Mark PO as delivered
router.patch("/:id/deliver", authenticate, async (req, res, next) => {
  try {
    const service = new PurchaseOrdersService();
    const po = await service.markDelivered(req.params.id);
    res.status(200).json({ success: true, data: po });
  } catch (error) {
    next(error);
  }
});

export default router;

