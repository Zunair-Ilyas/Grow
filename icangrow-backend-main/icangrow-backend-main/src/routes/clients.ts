import express from "express";
import { ClientsService } from "../services/clients";
import { authenticate } from "../middleware/auth";

const router = express.Router();
const clientsService = new ClientsService();

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  license_number?: string | null;
  client_type: string;
  status: string;
  notes?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// GET /api/v1/clients
router.get("/", authenticate, async (req, res, next) => {
  try {
    const { search, status, type } = req.query;
    const clients = await clientsService.getClients({
      search: typeof search === 'string' ? search : undefined,
      status: typeof status === 'string' ? status : undefined,
      type: typeof type === 'string' ? type : undefined,
    });
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/clients/:id
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await clientsService.deleteClient(id);
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/clients/:id/archive
router.patch("/:id/archive", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    await clientsService.archiveClient(id);
    res.json({ success: true, message: "Client archived successfully" });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/clients/stats
router.get("/stats", authenticate, async (req, res, next) => {
  try {
    const clients = await clientsService.getClients({}) as Client[];
    const total_clients = clients.length;
    const active_clients = clients.filter((c: Client) => c.status === "active").length;
    const prospect_clients = clients.filter((c: Client) => c.status === "prospect").length;
    const archived_clients = clients.filter((c: Client) => c.status === "archived").length;

    res.json({
      success: true,
      data: {
        total_clients,
        active_clients,
        prospect_clients,
        archived_clients,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/clients
router.post("/", authenticate, async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      address,
      license_number,
      client_type,
      status,
      notes
    } = req.body;
    const created_by = (req.user as import("../utils/jwt").JWTPayload)?.userId;
    if (!created_by) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const clientData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      address: address?.trim() || null,
      license_number: license_number?.trim() || null,
      client_type,
      status,
      notes: notes?.trim() || null,
      created_by
    };
    const client = await clientsService.createClient(clientData);
    res.json({ success: true, message: "Client created successfully", data: client });
    return;
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ success: false, message: "A client with this email already exists" });
      return;
    }
    next(error);
    return;
  }
});

// PATCH /api/v1/clients/:id
router.patch("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      company,
      address,
      license_number,
      client_type,
      status,
      notes
    } = req.body;
    const clientData = {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      address: address?.trim() || null,
      license_number: license_number?.trim() || null,
      client_type,
      status,
      notes: notes?.trim() || null
    };
    const client = await clientsService.updateClient(id, clientData);
    res.json({ success: true, message: "Client updated successfully", data: client });
    return;
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(409).json({ success: false, message: "A client with this email already exists" });
      return;
    }
    next(error);
    return;
  }
});

export default router;
