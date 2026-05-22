import http from 'http';

// in-memory data store as if it were a real database
const data = {
  1: { id: 1, name: 'Budiman', gpa: 3.9, semester: 4 },
  2: { id: 2, name: 'Herman', gpa: 3.94, semester: 6 },
};
// track the last assigned id for new records
let lastId = 2;

// CRUD (Create, Read, Update, Delete)

// Read (R)
// return all students
function getAllStudents(req, res) {
  // build an array from the object map for JSON output
  const students = Object.values(data).map((student) => student);

  // send the array as JSON with 200 OK
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(students));
}

// Read (R)
// return one student by id from the path
function getStudent(req, res) {
  // the id is the last segment in /students/:id
  const id = req.url.pathname.split('/').at(-1);
  const student = data[id];
  if (!student) {
    // report missing data with 404
    res.writeHead(404);
    return res.end(`Student with id ${id} not found!`);
  }

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(student));
}

// Create (C)
// create a new student from JSON request body
async function createStudent(req, res) {
  // wait until all body chunks arrive before parsing
  await readRequestBody(req);
  // parse JSON payload into fields
  const body = JSON.parse(req.body);
  const { name, gpa, semester } = body;

  // assign a new id and store the record
  data[++lastId] = {
    id: lastId,
    name,
    gpa,
    semester,
  };

  res.setHeader('Content-Type', 'application/json');
  // reply with 201 Created
  res.writeHead(201);
  res.end(JSON.stringify(data[lastId]));
}

// Update (U)
// update an existing student by id
async function updateStudent(req, res) {
  // wait for the full request body before parsing and merging updates
  await readRequestBody(req);
  const body = JSON.parse(req.body);

  const id = req.url.pathname.split('/').at(-1);
  const student = data[id];
  if (!student) {
    res.writeHead(404);
    return res.end(`Student with id ${id} not found!`);
  }

  // merge incoming fields into the existing object
  data[id] = {
    ...student,
    ...body,
  };

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(data[id]));
}

// Delete (D)
function deleteStudent(req, res) {
  const id = req.url.pathname.split('/').at(-1);
  if (!data[id]) {
    res.writeHead(404);
    return res.end(`Student with id ${id} not found!`);
  }

  // remove the record from the in-memory data
  delete data[id];

  res.writeHead(200);
  res.end(`Student with id ${id} has been successfully deleted!`);
}

// Helpers

// simple health check
function healthCheck(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(200);
  res.end('pong');
}

// log the method and path for visibility
function requestScanner(req, res) {
  const { method, url } = req;
  console.log(`${method}:${url.pathname}`);
}

// collect request body data from the stream
function readRequestBody(req) {
  return new Promise((resolve) => {
    let buffer = '';

    // buffer all chunks into a string
    req.on('data', (chunk) => (buffer += chunk.toString()));

    req.on('end', () => {
      // make body available to request handlers
      req.body = buffer;
      resolve();
    });
  });
}

function requestHandler(req, res) {
  // parse the URL so pathname is easy to read
  req.url = new URL(`http://localhost:8000${req.url}`);
  const { pathname } = req.url;

  // health check endpoint
  if (pathname === '/ping') return healthCheck(req, res);

  if (pathname.startsWith('/students')) {
    // route requests for /students based on HTTP method
    switch (req.method) {
      case 'GET':
        // if the path ends with a numeric id, return a single student
        if (pathname.match(/\/(\d+)$/)) return getStudent(req, res);
        else return getAllStudents(req, res);
      case 'POST':
        return createStudent(req, res);
      case 'PUT':
        return updateStudent(req, res);
      case 'DELETE':
        return deleteStudent(req, res);
      default:
        break;
    }
  }

  // fallback for unknown routes
  res.statusCode = 404;
  res.end();
}

// create an HTTP server with a single request handler
const server = http.createServer(requestHandler);

// tap into the request event to log every hit
server.on('request', requestScanner);

// start listening on http://localhost:8000
server.listen(8000, 'localhost', () => {
  console.log('Server is running...');
});
