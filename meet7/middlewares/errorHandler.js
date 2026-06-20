// Express's special 4-parameter error-handling middleware.
// Express identifies this as an error handler because it has EXACTLY 4 parameters.
// It must be registered LAST in index.js, after all other app.use() and routes.
//
// When any route handler or middleware calls next(someError), Express skips all
// regular middleware and jumps directly to this function.
//
// The Golden Rule of Error Responses (OWASP A10):
//   - Log the FULL error internally (stack trace, details).
//   - Send only a CLEAN & GENERIC message externally to the client.
//   Never expose stack traces, file paths, or internal architecture to clients.
//
export const errorHandler = (err, req, res, next) => {
  // Log the full error internally so developers can debug it.
  console.error(`[ERROR] ${new Date().toISOString()}`, err.stack);

  // Determine the HTTP status code.
  // Controllers may attach a .status property to errors before calling next(err).
  const statusCode = err.status || err.statusCode || 500;

  // Send a clean, generic response to the client.
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
};
