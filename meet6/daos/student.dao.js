import db from '../db/database.js';

// Prepared statements are compiled once and reused — efficient and safe from SQL injection.
const stmts = {
  findAll:  db.prepare('SELECT * FROM students ORDER BY id'),
  findById: db.prepare('SELECT * FROM students WHERE id = @id'),
  create:   db.prepare(`
    INSERT INTO students (nim, name, gpa, semester, major)
    VALUES (@nim, @name, @gpa, @semester, @major)
  `),
  update:   db.prepare(`
    UPDATE students
    SET nim = @nim, name = @name, gpa = @gpa, semester = @semester, major = @major
    WHERE id = @id
  `),
  delete:   db.prepare('DELETE FROM students WHERE id = @id'),
};

export const studentDao = {
  findAll: () =>
    stmts.findAll.all(),

  findById: (id) =>
    stmts.findById.get({ id }),

  create: (data) => {
    const info = stmts.create.run(data);
    return stmts.findById.get({ id: info.lastInsertRowid });
  },

  update: (id, data) => {
    stmts.update.run({ ...data, id });
    return stmts.findById.get({ id });
  },

  delete: (id) =>
    stmts.delete.run({ id }),
};
