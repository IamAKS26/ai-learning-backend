import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Token invalid"
    });

  }

};

/**
 * Optional auth — populates req.user if a valid Bearer token is present,
 * but never blocks the request. Use on public routes that need owner-aware logic.
 */
export const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (_) {
      // invalid token — treat as unauthenticated, don't reject
    }
  }
  next();
};