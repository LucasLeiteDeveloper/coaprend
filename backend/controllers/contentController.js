const { db } = require("../config/db"); //gets the firestore

/* create a new room of content on Firestore
the req.user.uid will be send from authenticateToken*/
exports.createContentRoom = async (req, res) => {
    try {
        const { title, description, icon } = req.body;
        //come from authenticateToken
        const creatorUid = req.user.uid;

        if(!title) return res.status(400).json({ error: "O campo 'title' é obrigatório!" });

        //create a new doc on firestore
        const newRoomRef = db.collection('room').doc();

        //data to insert in room
        const roomData = {
            title: title,
            creatorUid: creatorUid,
            description: description || "",
            icon: icon || null,
            membersId: [creatorUid]
        };

        //set the data
        await newRoomRef.set(roomData);

        return res.status(201).json({
            message: "Sala de conteúdo criada com sucesso!",
            roomId: newRoomRef.id,
            data: roomData
        });
    } catch(error){
        console.error("Erro ao criar sala de conteúdo: ", error);
        return res.status(500).json({ error: "Erro interno" })
    }
}

// create a new post in a room
// route: POST /api/content/posts
exports.createPost = async (req, res)=> {
    try {
        // receives the author uid 
        const authorUid = req.user.uid;
    
        //gets the nome of token 
        const username = req.user.name;

        const { title, roomId, texts, images, marker } = req.body;

        if(!title ||  !roomId || !texts) return res.status(400).json({ error: "Campos 'title', 'roomId' e 'texts' são obrigatórios!" });

        const postData = {
            title,
            roomId,
            authorUid,
            username: username || "Usuário",
            texts: Array.isArray(texts) ? texts: [texts], // garants that texts be an array
            images: images || [],
            marker: marker || null,
            dt_create: new Date()
        };

        //save the new post
        const newPostRef = await db.collection('posts').add(postData);

        return res.status(201).json({
            message: "Post criado com sucesso!",
            postId: newPostRef.id
        });
    }catch(error){
        console.error("Erro ao criar o post: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}


// list all posts of an specific room
// route: GET /api/content/rooms/:roomId/posts
exports.getPostsForRoom = async (req, res) => {
    try {
        // get the room's id
        const { roomId } = req.params;

        // gets a reference of collecion posts
        const postsRef = db.collection('posts');

        // get the posts referenced by the roomId
        const snapshot = await postsRef.where('roomId', '==', roomId)
                                        .orderBy('dt_create', 'desc')
                                        .get();


        // if there's no post, return an empty array
        if(snapshot.empty) return res.status(200).json([]);

        // create an array with the posts
        const posts = snapshot.docs.map( doc => ( { id: doc.id, ...doc.data() } ) );
        return res.status(200).json(posts);
    } catch(error){
        console.error("Erro ao listar posts: ", error );
        return res.status(500).json({ error: "Erro interno!" });
    }
}

// create a new task in a room
// route: POST /api/content/tasks
exports.createTask = async (req, res) => {
    try {
        // the last_day needs to come in a string ISO
        const { title, roomId, last_day } = req.body;

        if(!title || !roomId || !last_day) return res.status(400).json({ error: "Campos 'title', 'roomId' e 'last_day' são obrigatórios!" })

        const taskData = {
            title,
            roomId,
            last_day: new Date(last_day),
            finishedBy: []
        };

        const newTaskRef = await db.collection('tasks').add(taskData);

        return res.status(201).json({
            message: "Tarefa criada com sucesso!",
            taskId: newTaskRef.id
        });
    } catch(error){
        console.error("Erro ao criar a tarefa: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}

// get all tasks of an specific room
// route: GET /api/contnet/rooms/:roomId/tasks
exports.getTasksForRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
 
        // create a reference of taskRef and get the tasks of room
        const taskRef = db.collection('tasks');
        const snapshot = await taskRef.where('roomId', '==', roomId)
                                        .orderBy('last_day', 'asc')
                                        .get();

        if(snapshot.empty) return res.status(200).json([]);

        const tasks = snapshot.docs.map( doc => ({id: doc.id, ...doc.data()}) );
        return res.status(200).json(tasks);
    } catch(error){
        console.error("Erro ao listar tarefas: ", error);
        return res.status(500).json({ error: "Erro interno" })
    }
}