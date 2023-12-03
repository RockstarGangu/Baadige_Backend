import JwtService from "../services/JWTService.js";

const auth = async (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, message: "UnAuthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { _id,} = await JwtService.verify(token);
    const user = {
      _id,
    };
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "UnAuthorized" });
  }
};

export default auth;
