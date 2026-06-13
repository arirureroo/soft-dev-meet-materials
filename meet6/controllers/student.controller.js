import { studentService } from "../services/student.service.js";

// The controller is the HTTP layer's representative.
// Its only jobs are:
//   1. Extract data from req (params, body, query)
//   2. Call the appropriate service method
//   3. Send the correct HTTP response (status code + JSON)

export const studentController = {
  getAll: (req, res) => {
    const students = studentService.getAllStudents();
    res.json(students);
  },

  getOne: (req, res) => {
    try {
      const student = studentService.getStudentById(req.params.id);
      res.json(student);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  create: (req, res) => {
    try {
      const student = studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  update: (req, res) => {
    try {
      const student = studentService.updateStudent(req.params.id, req.body);
      res.json(student);
    } catch (error) {
      const status = error.message.includes("not found") ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  remove: (req, res) => {
    try {
      studentService.deleteStudent(req.params.id);
      res.json({
        message: `Student with id ${req.params.id} has been successfully deleted`,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};
