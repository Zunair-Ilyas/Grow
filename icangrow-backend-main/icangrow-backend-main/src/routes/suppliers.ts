import express from "express";
import { SuppliersService } from "../services/suppliers";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// GET /api/v1/suppliers - List suppliers with optional filters
router.get("/", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const filters = {
      searchTerm: req.query.searchTerm as string,
      status: req.query.status as string,
      supplier_type: req.query.supplier_type as string,
      approval_status: req.query.approval_status as string,
    };
    const suppliers = await service.getSuppliers(filters);
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/suppliers/:id - Get supplier details
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const supplier = await service.getSupplierById(req.params.id);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/suppliers - Create supplier
router.post("/", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const created_by = req.user?.userId;
    const supplier = await service.createSupplier({ ...req.body, created_by });
    res.status(201).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/suppliers/:id - Update supplier
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const supplier = await service.updateSupplier(req.params.id, req.body);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/suppliers/:id/approve - Approve or reject supplier
router.patch("/:id/approve", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const { status } = req.body; // 'approved' or 'rejected'
    const approved_by = req.user?.userId;
    if (!approved_by) {
      res.status(400).json({ success: false, error: "Missing approved_by user ID" });
      return;
    }
    const supplier = await service.approveSupplier(req.params.id, status, approved_by);
    res.status(200).json({ success: true, data: supplier });
    return;
  } catch (error) {
    next(error);
    return;
  }
});

// PATCH /api/v1/suppliers/:id/archive - Archive supplier
router.patch("/:id/archive", authenticate, async (req, res, next) => {
  try {
    const service = new SuppliersService();
    const supplier = await service.archiveSupplier(req.params.id);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
});

export default router;
