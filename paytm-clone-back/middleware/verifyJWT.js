const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.json({ message: "Unauthorized" }).status(401);
  }

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.json({ message: "Unauthorized" }).status(401);
      req.user = decoded.credentials.username;
      req.firstname = decoded.credentials.firstname;
      req.lastname = decoded.credentials.lastname;
      next();
    });
  } catch (error) { 
    return res.json({message:'Unauthorized'}).status(401)
  }
};
