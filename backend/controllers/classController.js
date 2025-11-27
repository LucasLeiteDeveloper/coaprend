const { uid, db } = require("../config/db");
const { sendNotification } = require("../utils/notificationHelper.js");

// function to generate unique class code
function generateCode(){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = '';

    for(let i = 0; i < 6; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }        

    return result
}

// create a new class
exports.createClass = async (req, res) => {
    try {
        const { title, description, icon, tags } = req.body;

        creatorUid = req.user.uid;

        if(!title) return res.status(400).json({ error: "O campo 'title' é obrigatório!"});

        // generate unique classCode
        let classCode;
        let codeAlreadyExists;

        do {
            classCode = generateCode();

            const codeSnapshot = await db.collection('classes')
                                        .where('code', '==', classCode)
                                        .limit(1)
                                        .get();
                                        
            codeAlreadyExists = !codeSnapshot.empty;
        } while(codeAlreadyExists);

        const newClassRef = db.collection('classes').doc();
        const classData = {
            id: newClassRef.id,
            title: title,
            creatorUid: creatorUid,
            description: description || "",
            icon: icon || null,
            tags: tags || [],
            membersId: [creatorUid],
            code: classCode,
            createdAt: new Date(),
            membersCount: 1
        };

        await newClassRef.set(classData);

        return res.status(201).json({
            message: "Sala criada com sucesso!",
            classId: newClassRef.id,
            code: classCode,
            data: classData
        });
    } catch(error){
        console.error("Erro ao criar saala", error);
        return res.status(500).json({ error: "Erro interno" })
    }
}

exports.enterClass = async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        if(!code) return res.status(400).json({ error: "Código da sala é obrigatório!" });
        
        // find class by code
        const classSnapshot = await db.collection('classes')
                                    .where('code', '==', code)
                                    .limit(1)
                                    .get();

        if(classSnapshot.empty) return res.status(404).json({ error: "Código inválido ou sala não encontrada!" });

        const classDoc = classSnapshot.docs[0];
        const classData = classDoc.data();

        // check if user is already a member
        if(classData.membersId.includes(userId)) return res.status(400).json({ error: "Você já está nesta sala!" });

        // add user to members
        await classDoc.ref.update({
            membersId: [...classData.membersId, userId],
            membersCount: (classData.membersCount || classData.membersId.length) + 1
        });

        // send notification to class cretor
        if(classData.creatorUid !== userId) {
            sendNotification(
                classData.creatorUid,
                "Novo membro na sala!",
                `Um novo usuário entrou na sala ${classData.title}`,
                "class_join"
            );
        }

        return res.status(200).json({
            message: "Você entrou na sala com sucesso!",
            classId: classDoc.id,
            data: {
                ...classData,
                membersId: [...classData.membersId, userId],
                membersCount: (classData.membersCount || classData.membersId.length) + 1
            }
        });
    } catch(error) {
        console.error("Erro ao entrar na sala: ", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}

// gets class details
exports.getClassDetails = async (req, res) => {
    try {
        const { classId } = req.params;

        const classRef = db.collection('classes').doc(classId);
        const classDoc = await classRef.get();

        if(!classDoc.exists) return res.status(404).json({ error: "Sala não encontrada!" });

        const classData = classDoc.data();

        // gets creator user data
        let creatorData = null;
        try {
            const creatorDoc = await db.collection('users').doc(classData.creatorUid).get();

            if(creatorDoc.exists) {
                const creatorUserData = creatorDoc.data();

                creatorData = {
                    id: creatorUserData.uid,
                    name: creatorUserData.name,
                    username: creatorUserData.username,
                    imgAccount: creatorUserData.imgAccount
                };
            }
        } catch(error){
            console.error("Erro ao buscar dados do criador: ", error);
        }

        return res.status(200).json({
            ...classData,
            creator: creatorData
        })
    } catch(error){
        console.error("Erro ao buscar detalhes da sala: ", error);
    }
}

// get user's classes
exports.getUserClasses = async (req, res) => {
    try {
        const userId = req.user.uid;

        const classesSnapshot = await db.collection('classes')
                                    .where('membersId', 'array-contains', userId)
                                    .orderBy('createdAt', 'desc')
                                    .get();
        if(classesSnapshot.empty) return res.status(200).json([]);

        const classes = await Promise.all(
            classesSnapshot.docs.map(async (doc) => {
                const classData = doc.data();

                // creator info
                let creatorData = null;
                try {
                    const creatorDoc = await db.collection('users').doc(classData.creatorUid).get();
                    
                    if(creatorDoc.exists){
                        const creatorUserData = creatorDoc.data();

                        creatorData = {
                            id: creatorUserData.uid,
                            name: creatorUserData.name,
                            username: creatorUserData.username,
                            imgAccount: creatorUserData.imgAccount
                        }
                    }
                } catch(error){
                    console.error("Erro ao buscar criador: ", error);
                }

                return {
                    id: doc.id,
                    ...classData,
                    creator: creatorData
                };
            })
        );

        return res.status(200).json(classes);
    } catch(error){
        console.error("Erro ao buscar salas do usuário: ", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}


// UPDATING CLASS
exports.updateClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const updates = req.body;
        const userId = req.user.uid;

        const classRef = db.collection('classes').doc(classId);
        const classDoc = await classRef.get();

        if (!classDoc.exists) {
            return res.status(404).json({ error: "Sala não encontrada!" });
        }

        const classData = classDoc.data();

        // Only creator can update the class
        if (classData.creatorUid !== userId) {
            return res.status(403).json({ error: "Apenas o criador da sala pode editá-la" });
        }

        // Remove fields that shouldn't be updated
        const allowedUpdates = ['title', 'description', 'icon', 'tags'];
        const filteredUpdates = {};
        
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        });

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ error: "Nenhum campo válido para atualizar" });
        }

        await classRef.update(filteredUpdates);

        return res.status(200).json({ 
            message: "Sala atualizada com sucesso!",
            updates: filteredUpdates
        });
    } catch (error) {
        console.error("Erro ao atualizar sala: ", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}

//DELETING CLASS
// Delete class
exports.deleteClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const userId = req.user.uid;

        const classRef = db.collection('classes').doc(classId);
        const classDoc = await classRef.get();

        if (!classDoc.exists) {
            return res.status(404).json({ error: "Sala não encontrada!" });
        }

        const classData = classDoc.data();

        // Only creator can delete the class
        if (classData.creatorUid !== userId) {
            return res.status(403).json({ error: "Apenas o criador da sala pode deletá-la" });
        }

        // Delete all posts and tasks associated with this class
        const batch = db.batch();
        
        // Delete posts
        const postsSnapshot = await db.collection('posts')
            .where('classId', '==', classId)
            .get();
        
        postsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete tasks
        const tasksSnapshot = await db.collection('tasks')
            .where('classId', '==', classId)
            .get();
        
        tasksSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Delete the class itself
        batch.delete(classRef);

        await batch.commit();

        return res.status(200).json({ message: "Sala e todo seu conteúdo foram deletados com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar sala: ", error);
        return res.status(500).json({ error: "Erro interno" });
    }
}