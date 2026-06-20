import { Router } from 'express';
import { studentController } from '../controllers/student.controller.js';
import { enrollmentController } from '../controllers/enrollment.controller.js';
import { validate } from '../middlewares/validate.js';
import { createStudentSchema, updateStudentSchema } from '../validators/student.validator.js';

const router = Router();

// This file contains zero business logic
// only URL definitions and middleware wiring.
// The order matters: more specific routes (/:id/enrollments) must come before the generic (/:id).

router.get('/', studentController.getAll);
router.get('/:id/enrollments', enrollmentController.getStudentEnrollments);
router.get('/:id', studentController.getOne);

// validate(schema) runs BEFORE the controller.
// If the request body fails validation, it returns a 400, the controller never runs.
router.post('/', validate(createStudentSchema), studentController.create);
router.put('/:id', validate(updateStudentSchema), studentController.update);

router.delete('/:id', studentController.remove);

export default router;
