import { studentDao } from "../daos/student.dao.js";

// The service layer enforces business rules and orchestrates DAO calls.
// It does not know about HTTP — no req, no res, no status codes here.
// It communicates outcomes by returning values or throwing errors.

export const studentService = {
  getAllStudents: () => {
    return studentDao.findAll();
  },

  getStudentById: (id) => {
    const student = studentDao.findById(id);
    if (!student) throw new Error(`Student with id ${id} not found`);
    return student;
  },

  createStudent: (data) => {
    return studentDao.create(data);
  },

  // Supports partial updates: only the fields provided in `partialData` are changed.
  // Fields not included keep their current values.
  updateStudent: (id, partialData) => {
    const existing = studentDao.findById(id);
    if (!existing) throw new Error(`Student with id ${id} not found`);
    const merged = { ...existing, ...partialData };
    return studentDao.update(id, merged);
  },

  deleteStudent: (id) => {
    const student = studentDao.findById(id);
    if (!student) throw new Error(`Student with id ${id} not found`);
    studentDao.delete(id);
  },
};
