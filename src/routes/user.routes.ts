import express from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.route("/").post(userController.createUserOrUpdate);
router.post("/connect", userController.connect);
router.post("/fetchPastEvents", authMiddleware, userController.fetchPastEvents);
router.post(
  "/fetchAllPastEvents",
  authMiddleware,
  userController.fetchAllPastEvents
);

export default router;
