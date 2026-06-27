import { enrollmentDao } from '../daos/enrollment.dao.js';
import { studentDao } from '../daos/student.dao.js';
import { courseDao } from '../daos/course.dao.js';

// Business rule: a student may not be enrolled in more than 24 SKS at one time.
const MAX_CREDITS = 24;

export const enrollmentService = {
  getStudentEnrollments: (studentId) => {
    const student = studentDao.findById(studentId);
    if (!student) throw new Error(`Student with id ${studentId} not found`);
    return enrollmentDao.findByStudentId(studentId);
  },

  getCourseEnrollments: (courseId) => {
    const course = courseDao.findById(courseId);
    if (!course) throw new Error(`Course with id ${courseId} not found`);
    return enrollmentDao.findByCourseId(courseId);
  },

  enrollStudent: (studentId, courseId) => {
    // Verify both entities exist.
    const student = studentDao.findById(studentId);
    if (!student) throw new Error(`Student with id ${studentId} not found`);

    const course = courseDao.findById(courseId);
    if (!course) throw new Error(`Course with id ${courseId} not found`);

    // Enforce the 24-SKS business rule.
    const currentCredits = enrollmentDao.totalCreditsByStudent(studentId);
    if (currentCredits + course.credits > MAX_CREDITS) {
      throw new Error(
        `Enrollment rejected: ${student.name} is currently enrolled in ${currentCredits} SKS. ` +
          `Adding "${course.name}" (${course.credits} SKS) would exceed the ${MAX_CREDITS}-SKS limit.`,
      );
    }

    return enrollmentDao.create(studentId, courseId);
  },

  updateGrade: (enrollmentId, grade) => {
    const enrollment = enrollmentDao.findById(enrollmentId);
    if (!enrollment) throw new Error(`Enrollment with id ${enrollmentId} not found`);
    return enrollmentDao.updateGrade(enrollmentId, grade);
  },

  cancelEnrollment: (enrollmentId) => {
    const enrollment = enrollmentDao.findById(enrollmentId);
    if (!enrollment) throw new Error(`Enrollment with id ${enrollmentId} not found`);
    enrollmentDao.delete(enrollmentId);
  },
};
