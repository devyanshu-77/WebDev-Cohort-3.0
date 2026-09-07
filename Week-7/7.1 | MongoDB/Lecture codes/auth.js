import jwt from "jsonwebtoken";
const JWT_SECRET = "myJWTsecret";
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
}

export { auth, JWT_SECRET };
