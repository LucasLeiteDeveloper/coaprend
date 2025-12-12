//get the auth service from db.js
const { auth } = require("../config/db");

module.exports = async (req, res, next) => {
    if (req.method === "OPTIONS") return next();
    
    //check if was send all 
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) return res.status(401).send("Não autorizado!");

    //get the idToken
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
        //decode the idToken
        const decodedToken = await auth.verifyIdToken(idToken);

        //insert the user's data to req
        req.user = decodedToken;

        next();
    }catch(error){ //if there's an error
        return res.status(403).send("Token inválido!");
    }
}