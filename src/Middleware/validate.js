export const validate = (schema) => (req, res, next) => {
  try {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path[0],
        message: issue.message
      }));

      return res.status(400).json({
        message: "Validation failed",
        errors
      });
    }

    req.body = result.data;

    next();

  } catch (error) {
    next(error);
  }
};