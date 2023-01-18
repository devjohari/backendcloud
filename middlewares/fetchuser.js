const jwt = require("jsonwebtoken");
const secret = "devMon";

const fetchuser = (req, res, next) => {
   const tokenreq = req.header("token");
   if (!tokenreq) {
      res.status(401).send({
         error: "Please authenticate using a valid token",
      });
   }
   try {
      const data = jwt.verify(tokenreq, secret);
      req.user = data.user;
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
      next();
   } catch (error) {
      res.status(401).send({
         error: "Please authenticate using a valid token",
      });
   }
};

module.exports = fetchuser;
