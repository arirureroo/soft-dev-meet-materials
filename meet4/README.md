# Meet 4

Simple Node.js HTTP examples: a CRUD API for students and a streaming response demo.

## Files

- [index.js](index.js): Basic REST-style API for student data (in-memory).
- [stream.js](stream.js): Streams a response back in small chunks.
- [stream.html](stream.html): Browser client to visualize the streaming response.

## Run

These servers both use port `8000`, so run one at a time.

### CRUD API

```bash
node index.js
```

### Streaming demo

```bash
node stream.js
```

Then open [stream.html](stream.html) in your browser and click **Send**.

## API ([index.js](index.js))

Base URL: `http://localhost:8000`

- `GET /ping` -> `pong`
- `GET /students` -> list all students
- `GET /students/:id` -> get one student
- `POST /students` -> create a student
- `PUT /students/:id` -> update a student
- `DELETE /students/:id` -> delete a student

Example request body:

```json
{
  "name": "Alice",
  "gpa": 3.8,
  "semester": 2
}
```

## References

- https://nodejs.org/docs/latest/api/http.html
- https://www.w3schools.com/nodejs/nodejs_http.asp
- https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
