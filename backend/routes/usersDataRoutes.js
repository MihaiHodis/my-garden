import { Router } from "express";
import {
  listUsersData,
  getUserData,
  updateUserData
} from "../controllers/usersDataController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = Router();

// GET toate datele
router.get("/", verifyFirebaseToken, listUsersData);

// GET date pentru un utilizator după ID
router.get("/:id", verifyFirebaseToken, getUserData);

// POST pentru update profil (compatibilitate fallback)
router.post("/:id", verifyFirebaseToken, updateUserData);

// PATCH pentru update profil (metoda folosită de frontend)
router.patch("/:id", verifyFirebaseToken, updateUserData);

export default router;
