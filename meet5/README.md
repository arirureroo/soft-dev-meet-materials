# Meet 5: Database & Connectivity

Persistent relational data storage using SQLite and Node.js (`better-sqlite3`).

## Setup & Run

```bash
npm init -y
npm pkg set type="module"
npm install better-sqlite3
node index.js
```

The server runs on `http://localhost:8000`.

## Database Schema

- **students**: `id` (PK), `nim` (unique), `name`, `gpa`, `semester`, `major`
- **courses**: `id` (PK), `code` (unique), `name`, `credits`
- **enrollments**: `id` (PK), `student_id` (FK -> students), `course_id` (FK -> courses), `grade`

_Foreign keys are enforced with `ON DELETE CASCADE`._

## API Endpoints

- `GET /ping` &rarr; health check (`pong`)

### Students (`/students`)

- `GET /students` &rarr; list all students
- `GET /students/:id` &rarr; get a student by ID
- `POST /students` &rarr; create a student
- `PUT /students/:id` &rarr; update student profile
- `DELETE /students/:id` &rarr; delete student

### Courses (`/courses`)

- `GET /courses` &rarr; list all courses
- `GET /courses/:id` &rarr; get a course by ID
- `POST /courses` &rarr; create a course
- `PUT /courses/:id` &rarr; update course details
- `DELETE /courses/:id` &rarr; delete course

### Enrollments (`/enrollments`)

- `GET /students/:id/enrollments` &rarr; list enrollments for a student
- `GET /courses/:id/enrollments` &rarr; list enrollments for a course
- `POST /enrollments` &rarr; enroll a student in a course
- `PUT /enrollments/:id/grade` &rarr; update grade for an enrollment
- `DELETE /enrollments/:id` &rarr; cancel/delete an enrollment

## References

### Project

- [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3)
- [SQLite Foreign Keys](https://sqlite.org/foreignkeys.html)
- [Node.js Native HTTP](https://nodejs.org/docs/latest/api/http.html)

### Introduction to Database

- [An Introduction to Databases — DigitalOcean](https://www.digitalocean.com/community/conceptual-articles/an-introduction-to-databases)
- [What is Database? Definition, Types, and Components — GeeksforGeeks](https://www.geeksforgeeks.org/dbms/what-is-database/)

### Relational vs. Non-Relational

- [Relational Model in DBMS — GeeksforGeeks](https://www.geeksforgeeks.org/dbms/relational-model-in-dbms/)
- [Relational vs. Non-Relational Databases — AWS](https://aws.amazon.com/compare/the-difference-between-relational-and-non-relational-databases/)
- [Relational vs. Non-Relational Databases — Pluralsight](https://www.pluralsight.com/resources/blog/software-development/relational-vs-non-relational-databases)
- [Relational vs. Non-Relational Databases — insightsoftware](https://insightsoftware.com/blog/whats-the-difference-relational-vs-non-relational-databases/)
- [Relational vs. Non-Relational Databases — MongoDB](https://www.mongodb.com/resources/compare/relational-vs-non-relational-databases)

### Data Modeling

- [What Is Data Modeling? — IBM](https://www.ibm.com/think/topics/data-modeling)
- [What is Data Modeling? — AWS](https://aws.amazon.com/what-is/data-modeling/)
- [What is a Relational Data Model? — Databricks](https://www.databricks.com/blog/what-is-a-relational-data-model)

### Normalization

- [An Introduction to Database Normalization — DigitalOcean](https://www.digitalocean.com/community/tutorials/database-normalization)
- [Introduction of Database Normalization — GeeksforGeeks](https://www.geeksforgeeks.org/dbms/introduction-of-database-normalization/)
- [What is Database Normalization? — IBM](https://www.ibm.com/think/topics/database-normalization)
- [What is Database Normalization? — Google Cloud](https://cloud.google.com/discover/what-is-database-normalization)

### SQL Commands

- [SQL DDL, DQL, DML, DCL, TCL Commands — GeeksforGeeks](https://www.geeksforgeeks.org/sql/sql-ddl-dql-dml-dcl-tcl-commands/)
- [DDL and DML: Definitions, Differences, and Uses — Firebolt](https://www.firebolt.io/glossary-items/ddl-and-dml)
- [A Comprehensive Overview of SQL Categories: DDL, DML, DCL, and TCL — Medium](https://medium.com/@madhukalyan.899/a-comprehensive-overview-of-sql-categories-ddl-dml-dcl-and-tcl-17edf53db0df)
- [Mastering SQL Fundamentals: DDL, DML, DCL, DQL, Joins, and Set Operations — Medium](https://medium.com/@animesh.shedge2002/mastering-sql-fundamentals-ddl-dml-dcl-dql-joins-and-set-operations-2be073c74859)

### SQL Order of Execution

- [SQL Order of Execution — DataCamp](https://www.datacamp.com/tutorial/sql-order-of-execution)
- [Order of Execution of SQL Queries — GeeksforGeeks](https://www.geeksforgeeks.org/sql/order-of-execution-of-sql-queries/)
- [Order of Operations and Order of Execution in SQL — The Data School](https://www.thedataschool.co.uk/le-luu/order-of-operations-and-order-of-execution-in-sql/)
- [SQL Execution Order — Codecademy](https://www.codecademy.com/article/sql-execution-order)
