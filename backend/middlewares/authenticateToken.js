//get the auth service from db.js
const { auth } = require("../config/db");

async function checkAuth(req, res, next){
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) return res.status(401).send("Não autorizado!");
}