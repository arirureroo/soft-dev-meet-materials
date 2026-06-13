import express from "express";
import studentRouter from "./routes/student.router.js";
import courseRouter from "./routes/course.router.js";
import enrollmentRouter from "./routes/enrollment.router.js";

const app = express();

// Middleware: parse incoming JSON request bodies automatically.
// This replaces the manual readRequestBody() helper we wrote in Meet 5.
app.use(express.json());

// Health check
app.get("/ping", (req, res) => res.send("pong"));

// Mount routers — each router handles all routes under its prefix.
app.use("/students", studentRouter);
app.use("/courses", courseRouter);
app.use("/enrollments", enrollmentRouter);

// 404 fallback for any unmatched route
app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Campus Portal API is running on http://localhost:${PORT}`);
});
