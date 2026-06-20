import express from 'express';
import studentRouter from './routes/student.router.js';
import courseRouter from './routes/course.router.js';
import enrollmentRouter from './routes/enrollment.router.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Middleware: parse incoming JSON request bodies automatically.
app.use(express.json());

app.get('/ping', (req, res) => res.send('pong'));

app.use('/students', studentRouter);
app.use('/courses', courseRouter);
app.use('/enrollments', enrollmentRouter);

// 404 fallback for any unmatched route
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

// Centralized error handler.
// MUST be the last middleware registered
// Express.js identifies it by its 4 parameters.
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Campus Portal API is running on http://localhost:${PORT}`);
});
