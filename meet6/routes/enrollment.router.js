import { Router } from "express";
import { enrollmentController } from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", enrollmentController.enroll);
router.put("/:id/grade", enrollmentController.updateGrade);
router.delete("/:id", enrollmentController.cancel);

export default router;
