import db from '../db/database.js';

const stmts = {
  findById: db.prepare('SELECT * FROM enrollments WHERE id = @id'),

  findByStudentId: db.prepare(`
    SELECT
      e.id    AS enrollment_id,
      c.code,
      c.name  AS course_name,
      c.credits,
      e.grade
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.student_id = @studentId
    ORDER BY e.id
  `),

  findByCourseId: db.prepare(`
    SELECT
      e.id    AS enrollment_id,
      s.nim,
      s.name  AS student_name,
      e.grade
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    WHERE e.course_id = @courseId
    ORDER BY e.id
  `),

  // Counts how many total SKS (credits) a student is currently enrolled in.
  totalCreditsByStudent: db.prepare(`
    SELECT COALESCE(SUM(c.credits), 0) AS total
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.student_id = @studentId
  `),

  create:      db.prepare('INSERT INTO enrollments (student_id, course_id) VALUES (@studentId, @courseId)'),
  updateGrade: db.prepare('UPDATE enrollments SET grade = @grade WHERE id = @id'),
  delete:      db.prepare('DELETE FROM enrollments WHERE id = @id'),
};

export const enrollmentDao = {
  findById: (id) =>
    stmts.findById.get({ id }),

  findByStudentId: (studentId) =>
    stmts.findByStudentId.all({ studentId }),

  findByCourseId: (courseId) =>
    stmts.findByCourseId.all({ courseId }),

  totalCreditsByStudent: (studentId) =>
    stmts.totalCreditsByStudent.get({ studentId }).total,

  create: (studentId, courseId) => {
    const info = stmts.create.run({ studentId, courseId });
    return stmts.findById.get({ id: info.lastInsertRowid });
  },

  updateGrade: (id, grade) => {
    stmts.updateGrade.run({ id, grade });
    return stmts.findById.get({ id });
  },

  delete: (id) =>
    stmts.delete.run({ id }),
};
