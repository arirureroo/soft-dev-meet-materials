import { enrollmentService } from '../services/enrollment.service.js';

export const enrollmentController = {
  getStudentEnrollments: (req, res, next) => {
    try {
      const enrollments = enrollmentService.getStudentEnrollments(req.params.id);
      res.json(enrollments);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },

  getCourseEnrollments: (req, res, next) => {
    try {
      const enrollments = enrollmentService.getCourseEnrollments(req.params.id);
      res.json(enrollments);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },

  enroll: (req, res, next) => {
    try {
      const { student_id, course_id } = req.body;
      const enrollment = enrollmentService.enrollStudent(student_id, course_id);
      res.status(201).json(enrollment);
    } catch (error) {
      error.status = error.message.includes('not found') ? 404 : 400;
      next(error);
    }
  },

  updateGrade: (req, res, next) => {
    try {
      const enrollment = enrollmentService.updateGrade(req.params.id, req.body.grade);
      res.json(enrollment);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },

  cancel: (req, res, next) => {
    try {
      enrollmentService.cancelEnrollment(req.params.id);
      res.json({
        message: `Enrollment with id ${req.params.id} has been successfully cancelled`,
      });
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },
};
