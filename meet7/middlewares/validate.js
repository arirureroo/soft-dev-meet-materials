// A middleware factory: a function that RETURNS a middleware function.
// We pass it a Joi schema, and it gives us back a middleware that validates the request body against that specific schema.
//
// Usage in a router:
//   router.post('/', validate(createStudentSchema), studentController.create);
//
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Collect ALL validation errors, not just the first one.
  });

  if (error) {
    // Map each Joi error detail into a plain string message.
    const messages = error.details.map((detail) => detail.message);

    return res.status(400).json({
      success: false,
      errors: messages,
    });
  }

  // Data is valid, pass the request forward to the controller.
  next();
};
