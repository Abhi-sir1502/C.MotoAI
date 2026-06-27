import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // CHANGE 1: 400 ki jagah 401 (Unauthorized) bhejna hai
    if (!token) {
      return res.status(401).json({ message: "No token found, please login." });
    }

    // CHANGE 2: jwt.verify ko safe block me rakhna hai kyunki yeh error throw karta hai
    try {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = verifyToken.userId;
      next(); 
    } catch (jwtError) {
      res.clearCookie("token");
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

  } catch (error) {
    return res.status(500).json({ message: `isAuth error ${error.message} `});
  }
};