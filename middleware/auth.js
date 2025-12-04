const jwt = require("jsonwebtoken");

function auth(req, res, next){
    const tokent = req.headers.authorization?.split(" ")[1];

    if(!tokent) return res.status(401).json({message: "No token provided"});

    try{
        const user = jwt.verify(tokent, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch(err){
        return res.status(401).json({message: "Invalid token"});
    }
}
module.exports = auth;