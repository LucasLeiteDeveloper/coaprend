//get the service of firestore
const { db } = require("../config/db");

//create an user
exports.registerUser = async (req, res) => {
    //get the info send by ionic
    const { uid, name, dt_birthday, email } = req.body;

    //validation
    if(!uid || !name || !email) return res.status(400).json({ error: "Essential data (uid, name or email) not send!" });

    try {
        //formating the dt_birthday
        let dt_birthdayFormated = null;
        if(dt_birthday) dt_birthdayFormated = new Date(dt_birthday);

        //create the document on firestore
        const userRef = db.collection('users').doc(uid);
        
        await userRef.set({
            name,
            email,
            dt_birthday: dt_birthdayFormated,
            imgAccount: null,
            bio: 'new user coaprend',
        });

        return res.status(201).json({
            message: "User and account created!",
            uid: uid,
        });
    }catch(error) { //in case of error..
        console.error("Error on register new user at Firestore: ", error);
        return res.status(500).json({
            error: "Internal error",
            uid: uid,
        });
    }
}
exports.loginUser = async (req, res)=> {
    console.log("Realizando login..")
    res.status(405).json({ message: "Essa rota deve ser acessada via firebase" })
}