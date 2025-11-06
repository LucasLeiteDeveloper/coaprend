//get the service of firestore
const { auth, db } = require("../config/db");

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

//sync the account
exports.syncProfile = async (req, res) => {
    try {
        //the authenticateToken already validate the token and give the req.user
        const { uid, name, email, picture } = req.user;

        //create an reference to the collection users with the uid
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        //if the user exists
        if(doc.exists) return res.status(200).json(doc.data());

        //if doesn't exists, create the account 
        const userData = {
            name: name || "Coaprend User",
            email: email,
            dt_birthday: null,
            imgAccount: picture || null, //'picture' comes from google
            bio: "new user",
        };

        //await the user being created
        await userRef.create(userData);

        return res.status(201).json(userData); // returns the profile
    }catch(error){
        console.error("Erro ao sincronizar perfil: ", error);
        return res.status(500).json({
            error: "Erro interno ao sincronizar o perfil"
        });
    }
}

//delete the account
exports.deleteUserAccount = async (req, res) => {
    try {  
        //get the uid by the middleware
        const { uid } = req.user;

        //execute the 2 exclusions 
        await Promise.all([
            auth.deleteUser(uid), //delete of firebase Auth
            db.collection('users').doc(uid).delete() //delete the profile of firestore
        ]);

        return res.status(200).json({
            message: "Conta excluída com sucesso!"
        })
    }catch(error) {
        console.error("Erro ao deletar usuário(a)");

        //in the case of user doesn't exists
        if(error.code === 'auth/user-not-found') return res.status(404).json({ error: "Usuário não encontrado" });

        return res.status(500).json({
            error: "Erro interno ao deletar usuário(a)"
        });
    }
}

// get the user profile data, its a secure route, 
exports.getUserProfile = async (req, res) => {
    try {
        const uid = req.user.uid; //UID will be send by anthenticateToken

        // get the users doc on firestore
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        //if the user doesn't exists
        if(!userDoc.exists) return res.status(404).json({ error: "Dados do usuário não encontrados" });

        const profileData = userDoc.data();

        return res.status(200).json(profileData);
    } catch(error){
        console.error(error);
        return res.status(500).json({ error: "Erro interno no servidor ao buscar perfil" })
    }
}