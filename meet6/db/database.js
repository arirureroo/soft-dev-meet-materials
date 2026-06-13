import Database from 'better-sqlite3';

const db = new Database('./portal.db');

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nim       TEXT NOT NULL UNIQUE,
    name      TEXT NOT NULL,
    gpa       REAL NOT NULL DEFAULT 0.0 CHECK(gpa >= 0.0 AND gpa <= 4.0),
    semester  INTEGER NOT NULL CHECK(semester >= 1 AND semester <= 14),
    major     TEXT NOT NULL DEFAULT 'Undeclared'
  );

  CREATE TABLE IF NOT EXISTS courses (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    code      TEXT NOT NULL UNIQUE,
    name      TEXT NOT NULL,
    credits   INTEGER NOT NULL CHECK(credits >= 1 AND credits <= 3)
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id  INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    grade       TEXT,

    FOREIGN KEY (student_id)  REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)   REFERENCES courses(id)  ON DELETE CASCADE,

    UNIQUE (student_id, course_id)
  );
`);

export default db;
