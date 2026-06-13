import { enrollmentService } from "../services/enrollment.service.js";

export const enrollmentController = {
  getStudentEnrollments: (req, res) => {
    try {
      const enrollments = enrollmentService.getStudentEnrollments(
        req.params.id,
      );
      res.json(enrollments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  getCourseEnrollments: (req, res) => {
    try {
      const enrollments = enrollmentService.getCourseEnrollments(req.params.id);
      res.json(enrollments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  enroll: (req, res) => {
    try {
      const { student_id, course_id } = req.body;
      const enrollment = enrollmentService.enrollStudent(student_id, course_id);
      res.status(201).json(enrollment);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  updateGrade: (req, res) => {
    try {
      const enrollment = enrollmentService.updateGrade(
        req.params.id,
        req.body.grade,
      );
      res.json(enrollment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  cancel: (req, res) => {
    try {
      enrollmentService.cancelEnrollment(req.params.id);
      res.json({
        message: `Enrollment with id ${req.params.id} has been successfully cancelled`,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};
