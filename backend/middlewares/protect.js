const jwt = require('jsonwebtoken');

const protect = (req,res,next) => {
    try {
       const token = req.headers.authorization.split(" ")[1];
       if(!token) {
        return res.status(401).json({message:"Unathorised access token is missing"});

       }

       let decodedData;

       decodedData = jwt.verify(token,process.env.JWT_SECRET);
       req.userId = decodedData.id;

       next();
       
    } catch (error) {
        res.status(401).json({message:"Unauthorised access, invalid token", error:error.message})
    }
}

module.exports = protect;