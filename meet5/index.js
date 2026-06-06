import http from 'http';
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

const queries = {
  getAllStudents: db.prepare('SELECT * FROM students ORDER BY id'),
  getStudentById: db.prepare('SELECT * FROM students WHERE id = ?'),
  createStudent: db.prepare(`
    INSERT INTO students (nim, name, gpa, semester, major)
    VALUES (@nim, @name, @gpa, @semester, @major)
  `),
  updateStudent: db.prepare(`
    UPDATE students
    SET nim = @nim, name = @name, gpa = @gpa, semester = @semester, major = @major
    WHERE id = ?
  `),
  deleteStudent: db.prepare('DELETE FROM students WHERE id = ?'),

  getAllCourses: db.prepare('SELECT * FROM courses ORDER BY id'),
  getCourseById: db.prepare('SELECT * FROM courses WHERE id = ?'),
  createCourse: db.prepare(`
    INSERT INTO courses (code, name, credits)
    VALUES (@code, @name, @credits)
  `),
  updateCourse: db.prepare(`
    UPDATE courses
    SET code = @code, name = @name, credits = @credits
    WHERE id = ?
  `),
  deleteCourse: db.prepare('DELETE FROM courses WHERE id = ?'),

  getStudentEnrollments: db.prepare(`
    SELECT
      e.id AS enrollment_id,
      c.code,
      c.name AS course_name,
      c.credits,
      e.grade
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
    WHERE e.student_id = ?
    ORDER BY e.id
  `),
  getCourseEnrollments: db.prepare(`
    SELECT
      e.id AS enrollment_id,
      s.nim,
      s.name AS student_name,
      e.grade
    FROM enrollments e
    JOIN students s ON s.id = e.student_id
    WHERE e.course_id = ?
    ORDER BY e.id
  `),
  getEnrollmentById: db.prepare('SELECT * FROM enrollments WHERE id = ?'),
  insertEnrollment: db.prepare('INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)'),
  updateGrade: db.prepare('UPDATE enrollments SET grade = @grade WHERE id = ?'),
  deleteEnrollment: db.prepare('DELETE FROM enrollments WHERE id = ?'),
};

/* students */

// GET /students
function getAllStudents(req, res) {
  const students = queries.getAllStudents.all();
  sendJSON(res, 200, students);
}

// GET /students/:id
function getStudent(req, res) {
  const id = getIdFromPath(req, 2);
  const student = queries.getStudentById.get(id);
  if (!student) return sendError(res, 404, `Student with id ${id} not found!`);

  sendJSON(res, 200, student);
}

// POST /students
// expected body: { nim, name, gpa, semester, major }
async function createStudent(req, res) {
  await readRequestBody(req);
  const { nim, name, gpa, semester, major } = JSON.parse(req.body);
  try {
    const info = queries.createStudent.run({ nim, name, gpa, semester, major });
    const student = queries.getStudentById.get(info.lastInsertRowid);
    sendJSON(res, 201, student);
  } catch (error) {
    sendError(res, 400, error);
  }
}

// PUT /students/:id
// expected body: any subset of { nim, name, gpa, semester, major }
// fields not included in the body keep their existing values (partial update)
async function updateStudent(req, res) {
  await readRequestBody(req);
  const id = getIdFromPath(req, 2);
  const student = queries.getStudentById.get(id);
  if (!student) return sendError(res, 404, `Student with id ${id} not found!`);

  const updated = { ...student, ...JSON.parse(req.body) };
  try {
    queries.updateStudent.run(id, { ...updated });
    sendJSON(res, 200, queries.getStudentById.get(id));
  } catch (error) {
    sendError(res, 400, error);
  }
}

// DELETE /students/:id
function deleteStudent(req, res) {
  const id = getIdFromPath(req, 2);
  const student = queries.getStudentById.get(id);
  if (!student) return sendError(res, 404, `Student with id ${id} not found!`);

  queries.deleteStudent.run(id);
  res.writeHead(200);
  res.end(`Student with id ${id} has been successfully deleted!`);
}

/* courses */

// GET /courses
function getAllCourses(req, res) {
  const students = queries.getAllCourses.all();
  sendJSON(res, 200, students);
}

// GET /courses/:id
function getCourse(req, res) {
  const id = getIdFromPath(req, 2);
  const course = queries.getCourseById.get(id);
  if (!course) return sendError(res, 404, `Course with id ${id} not found!`);

  sendJSON(res, 200, course);
}

// POST /courses
// expected body: { code, name, credits }
async function createCourse(req, res) {
  await readRequestBody(req);
  const { code, name, credits } = JSON.parse(req.body);
  try {
    const info = queries.createCourse.run({ code, name, credits });
    const course = queries.getCourseById.get(info.lastInsertRowid);
    sendJSON(res, 201, course);
  } catch (error) {
    sendError(res, 400, error);
  }
}

// PUT /courses/:id
// expected body: any subset of { code, name, credits }
async function updateCourse(req, res) {
  await readRequestBody(req);
  const id = getIdFromPath(req, 2);
  const course = queries.getCourseById.get(id);
  if (!course) return sendError(res, 404, `Course with id ${id} not found!`);

  const updated = { ...course, ...JSON.parse(req.body) };
  try {
    queries.updateCourse.run(id, { ...updated });
    sendJSON(res, 200, queries.getCourseById.get(id));
  } catch (error) {
    sendError(res, 400, error);
  }
}

// DELETE /courses/:id
function deleteCourse(req, res) {
  const id = getIdFromPath(req, 2);
  const course = queries.getCourseById.get(id);
  if (!course) return sendError(res, 404, `Course with id ${id} not found!`);

  queries.deleteCourse.run(id);
  res.writeHead(200);
  res.end(`Course with id ${id} has been successfully deleted!`);
}

/* enrollments */

// GET /students/:id/enrollments
function getStudentEnrollments(req, res) {
  const id = getIdFromPath(req, 2);
  const student = queries.getStudentById.get(id);
  if (!student) return sendError(res, 404, `Student with id ${id} not found!`);

  sendJSON(res, 200, queries.getStudentEnrollments.all(id));
}

// GET /courses/:id/enrollments
function getCourseEnrollments(req, res) {
  const id = getIdFromPath(req, 2);
  const course = queries.getCourseById.get(id);
  if (!course) return sendError(res, 404, `Course with id ${id} not found!`);

  sendJSON(res, 200, queries.getCourseEnrollments.all(id));
}

// POST /enrollments
async function createEnrollment(req, res) {
  await readRequestBody(req);
  const { student_id, course_id } = JSON.parse(req.body);

  try {
    const enrollment = db.transaction(() => {
      const student = queries.getStudentById.get(student_id);
      if (!student) throw new Error(`Student with id ${student_id} not found`);

      const course = queries.getCourseById.get(course_id);
      if (!course) throw new Error(`Course with id ${course_id} not found`);

      const info = queries.insertEnrollment.run(student_id, course_id);
      return queries.getEnrollmentById.get(info.lastInsertRowid);
    });
    sendJSON(res, 201, enrollment());
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 400;
    sendError(res, status, error.message);
  }
}

// PUT /enrollments/:id/grade
async function updateEnrollmentGrade(req, res) {
  await readRequestBody(req);
  const id = getIdFromPath(req, 2);
  const enrollment = queries.getEnrollmentById.get(id);
  if (!enrollment) return sendError(res, 404, `Enrollment with id ${id} not found!`);

  const { grade } = JSON.parse(req.body);
  queries.updateGrade.run(id, { grade });
  sendJSON(res, 200, queries.getEnrollmentById.get(id));
}

// DELETE /enrollments/:id
function deleteEnrollment(req, res) {
  const id = getIdFromPath(req, 2);
  const enrollment = queries.getEnrollmentById.get(id);
  if (!enrollment) return sendError(res, 404, `Enrollment with id ${id} not found!`);

  queries.deleteEnrollment.run(id);
  res.writeHead(200);
  res.end(`Enrollment with id ${id} has been successfully deleted!`);
}

/* helpers */

function healthCheck(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200);
  res.end('pong');
}

function sendJSON(res, status, data) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(status);
  res.end(
    JSON.stringify({
      error: message,
    }),
  );
}

function getIdFromPath(req, at) {
  return req.url.pathname.split('/').at(at);
}

function requestScanner(req, res) {
  const { method, url } = req;
  console.log(`${method}:${url.pathname}`);
}

function readRequestBody(req) {
  return new Promise((resolve) => {
    let buffer = '';
    req.on('data', (chunk) => (buffer += chunk.toString()));
    req.on('end', () => {
      req.body = buffer;
      resolve();
    });
  });
}

function requestHandler(req, res) {
  req.url = new URL(`http://localhost:8000${req.url}`);
  const { pathname } = req.url;

  if (pathname === '/ping') return healthCheck(req, res);

  if (pathname.startsWith('/students')) {
    if (pathname.match(/\/(\d+)\/enrollments$/) && req.method === 'GET')
      return getStudentEnrollments(req, res);

    switch (req.method) {
      case 'GET':
        if (pathname.match(/\/(\d+)$/)) return getStudent(req, res);
        else return getAllStudents(req, res);
      case 'POST':
        return createStudent(req, res);
      case 'PUT':
        return updateStudent(req, res);
      case 'DELETE':
        return deleteStudent(req, res);
    }
  }

  if (pathname.startsWith('/courses')) {
    if (pathname.match(/\/(\d+)\/enrollments$/) && req.method === 'GET')
      return getCourseEnrollments(req, res);

    switch (req.method) {
      case 'GET':
        if (pathname.match(/\/(\d+)$/)) return getCourse(req, res);
        else return getAllCourses(req, res);
      case 'POST':
        return createCourse(req, res);
      case 'PUT':
        return updateCourse(req, res);
      case 'DELETE':
        return deleteCourse(req, res);
    }
  }

  if (pathname.startsWith('/enrollments')) {
    switch (req.method) {
      case 'POST':
        return createEnrollment(req, res);
      case 'PUT':
        return updateEnrollmentGrade(req, res);
      case 'DELETE':
        return deleteEnrollment(req, res);
    }
  }

  // fallback for unknown routes
  sendError(res, 404, `Cannot ${req.method} ${pathname}`);
}

/* server setup */

const server = http.createServer(requestHandler);

server.on('request', requestScanner);

server.listen(8000, 'localhost', () => {
  console.log('Server is running...');
});

process.on('SIGINT', () => {
  db.close();
  console.log('\nDatabase closed. Server stopped.');
  process.exit(0);
});
