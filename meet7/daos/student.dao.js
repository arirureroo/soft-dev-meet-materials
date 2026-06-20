import db from '../db/database.js';

const stmts = {
  // Explicitly select columns
  // NEVER use SELECT * when a sensitive field exists.
  // password_hash is intentionally excluded from all read queries.
  findAll: db.prepare(`
    SELECT id, nim, name, gpa, semester, major
    FROM students
    ORDER BY id
  `),

  findById: db.prepare(`
    SELECT id, nim, name, gpa, semester, major
    FROM students
    WHERE id = @id
  `),

  // The DAO accepts password_hash
  // the service is responsible for hashing.
  create: db.prepare(`
    INSERT INTO students (nim, name, password_hash, gpa, semester, major)
    VALUES (@nim, @name, @password_hash, @gpa, @semester, @major)
  `),

  update: db.prepare(`
    UPDATE students
    SET nim = @nim, name = @name, gpa = @gpa, semester = @semester, major = @major
    WHERE id = @id
  `),

  delete: db.prepare('DELETE FROM students WHERE id = @id'),
};

export const studentDao = {
  findAll: () => stmts.findAll.all(),

  findById: (id) => stmts.findById.get({ id }),

  create: (data) => {
    // data must contain: { nim, name, password_hash, gpa, semester, major }
    const info = stmts.create.run(data);
    return stmts.findById.get({ id: info.lastInsertRowid });
  },

  update: (id, data) => {
    stmts.update.run({ ...data, id });
    return stmts.findById.get({ id });
  },

  delete: (id) => stmts.delete.run({ id }),
};
