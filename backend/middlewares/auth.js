const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Bearer token
  // [Bearer, token] after splitting  

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorizad access, token is missing" });
    }

    let decodedData;

    decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.senderId = decodedData.id; //defines actual user

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access, invalid Token",
      error: error.message,
    });
  }
};

module.exports = auth;
