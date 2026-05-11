import Log from '../../logging_middleware/logger.js';
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await Log("backend", "warn", "middleware", 
      "Unauthorized access attempt - no token provided"
    );
    return res.status(401).json({ message: 'No token provided' });
  }
  await Log("backend", "info", "middleware", 
    "Request authorized successfully"
  );
  next();
};