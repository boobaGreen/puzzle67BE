import express from "express";
import { userController } from "../controllers/user.controller";

const router = express.Router();

router.route("/").post(userController.createUserOrUpdate);
router.post("/fetchPastEvents", userController.fetchPastEvents);

export default router;
