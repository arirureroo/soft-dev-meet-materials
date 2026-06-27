# Meet 8: Integration — Connecting the Frontend to the Backend

This session covers the integration of a Vue 3 frontend (built with Vite and Pinia) with an Express.js backend (using SQLite and Joi). 

## Running the Application

You need to run both the frontend and backend servers simultaneously.

**1. Start the Backend API:**
```bash
cd api
npm install
npm run dev
```

**2. Start the Frontend Web App:**
```bash
cd web
npm install
npm run dev
```

The frontend will be accessible at `http://localhost:5173`.

## End-to-End Data Flow

```mermaid
sequenceDiagram
    participant UI as Vue Component (StudentsView.vue)
    participant Store as Pinia Store (student.js)
    participant API as API Service (api.js)
    participant Browser as Web Browser (CORS & fetch)
    participant Express as Express App (CORS & JSON)
    participant Router as Router (student.router.js)
    participant Validator as Validator (Joi)
    participant Controller as Controller (studentController.js)
    participant Service as Service (studentService.js)
    participant DAO as DAO (studentDao.js)
    participant DB as SQLite Database (portal.db)

    Note over UI, API: Frontend Layer (Vue, Port 5173)
    Note over Express, DB: Backend Layer (Express, Port 3000)

    UI->>Store: 1. User clicks 'Register' (Submit Form)
    Store->>API: 2. call apiFetch('/students', POST, data)
    API->>Browser: 3. fetch(URL, config)
    
    Note over Browser, Express: Preflight Request (OPTIONS)
    Browser->>Express: 4. OPTIONS /students (Preflight)
    Express-->>Browser: 5. 204 No Content (Access-Control-Allow-Origin)
    
    Note over Browser, Express: Actual Request
    Browser->>Express: 6. POST /students (JSON body)
    Express->>Router: 7. parse body, route to endpoint
    Router->>Validator: 8. forward to middleware
    Validator->>Controller: 9. validate body (Joi), proceed
    Controller->>Service: 10. createStudent(data)
    Service->>DAO: 11. hash password (bcrypt), create(data)
    DAO->>DB: 12. INSERT INTO students ...
    DB-->>DAO: 13. Return new row id
    DAO-->>Service: 14. Return student object
    Service-->>Controller: 15. Return student object
    Controller-->>Express: 16. res.status(201).json(student)
    Express-->>Browser: 17. 201 Created (w/ CORS headers)
    Browser-->>API: 18. response.ok, parse JSON
    API-->>Store: 19. Return parsed student object
    Store->>Store: 20. students.value.push(newStudent)
    Store-->>UI: 21. State changes, trigger re-render
```
