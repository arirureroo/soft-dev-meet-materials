import { Router } from 'express';
import { courseController } from '../controllers/course.controller.js';

import { enrollmentController } from '../controllers/enrollment.controller.js';

const router = Router();

router.get('/', courseController.getAll);
router.get('/:id/enrollments', enrollmentController.getCourseEnrollments);
router.get('/:id', courseController.getOne);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.remove);

export default router;
