import { studentService } from '../services/student.service.js';

export const studentController = {
  getAll: (req, res) => {
    const students = studentService.getAllStudents();
    res.json(students);
  },

  getOne: (req, res, next) => {
    try {
      const student = studentService.getStudentById(req.params.id);
      res.json(student);
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },

  // 'create' is async because studentService.createStudent() uses bcrypt (async).
  create: async (req, res, next) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      // SQLite throws a generic error for UNIQUE constraint violations.
      // We translate it into a more meaningful 409 Conflict response.
      if (error.message?.includes('UNIQUE constraint failed')) {
        error.status = 409; // 409 Conflict
        error.message = 'A student with this NIM already exists.';
      }
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const student = await studentService.updateStudent(req.params.id, req.body);
      res.json(student);
    } catch (error) {
      error.status = error.message.includes('not found') ? 404 : 400;
      next(error);
    }
  },

  remove: (req, res, next) => {
    try {
      studentService.deleteStudent(req.params.id);
      res.json({
        message: `Student with id ${req.params.id} has been successfully deleted`,
      });
    } catch (error) {
      error.status = 404;
      next(error);
    }
  },
};
