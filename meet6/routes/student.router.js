import { Router } from "express";
import { studentController } from "../controllers/student.controller.js";
import { enrollmentController } from "../controllers/enrollment.controller.js";

const router = Router();

// This file contains zero logic — only URL definitions.
// The order matters: more specific routes (/:id/enrollments) must come before the generic (/:id).

router.get("/", studentController.getAll);
router.get("/:id/enrollments", enrollmentController.getStudentEnrollments);
router.get("/:id", studentController.getOne);
router.post("/", studentController.create);
router.put("/:id", studentController.update);
router.delete("/:id", studentController.remove);

export default router;
