import bcrypt from 'bcrypt';
import { studentDao } from '../daos/student.dao.js';

// "salt rounds" controls how computationally expensive the hash is.
// Higher = slower to compute (more secure, but more CPU).
// 10 is the industry-standard default, takes ~100ms on modern hardware.
const SALT_ROUNDS = 10;

// The service layer enforces business rules and orchestrates DAO calls.
// It does not know about HTTP, no req, no res, no status codes here.
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

  // This method is async because bcrypt.hash() is asynchronous.
  // bcrypt deliberately performs many rounds of computation to be slow
  // running synchronously would block Node.js's thread for every registration.
  createStudent: async (data) => {
    // Destructure the plain-text password out of the incoming data.
    // `studentData` now contains: { nim, name, gpa, semester, major }
    const { password, ...studentData } = data;

    // Hash the plain-text password.
    // bcrypt automatically generates a unique random salt for each hash.
    // The salt is embedded in the resulting hash string, no need to store separately.
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Pass the HASH to the DAO, never the plain-text password.
    return studentDao.create({ ...studentData, password_hash });
  },

  // Password changes are NOT handled here (would require a separate, dedicated flow).
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
