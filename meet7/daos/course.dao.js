import db from '../db/database.js';

const stmts = {
  findAll:  db.prepare('SELECT * FROM courses ORDER BY id'),
  findById: db.prepare('SELECT * FROM courses WHERE id = @id'),
  create:   db.prepare(`
    INSERT INTO courses (code, name, credits)
    VALUES (@code, @name, @credits)
  `),
  update:   db.prepare(`
    UPDATE courses
    SET code = @code, name = @name, credits = @credits
    WHERE id = @id
  `),
  delete:   db.prepare('DELETE FROM courses WHERE id = @id'),
};

export const courseDao = {
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
