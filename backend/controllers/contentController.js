const { db } = require("../config/db"); //gets the firestore

/* create a new room of content on Firestore
the req.user.uid will be send from authenticateToken*/
exports.createContentRoom = async (req, res) => {
    try {
        const { title, description } = req.body;

        //come from authenticateToken
        const creatorUid = req.user.uid;

        if(!title) return res.status(400).json({ error: "O campo 'title' é obrigatório!" });

        //create a new doc on firestore
        const newRoomRef = db.collection('room').doc();

        //data to insert in room
        const roomData = {
            title: title,
            creatorUid: creatorUid,
            description: description
        };

        //set the data
        await newRoomRef.set(roomData);

        return res.status(201).json({
            message: "Sala de conteúdo criada com sucesso!",
            roomId: newRoomRef.id,
        });
    } catch(error){
        console.error("Erro ao criar sala de conteúdo: ", error);
        return res.status(500).json({ error: "Erro interno" })
    }
}