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
        // the dt_final needs to come in a string ISO
        const { title, roomId, dt_final } = req.body;

        if(!title || !roomId || !dt_final) return res.status(400).json({ error: "Campos 'title', 'roomId' e 'dt_final' são obrigatórios!" })

        const taskData = {
            title,
            roomId,
            dt_final: new Date(dt_final),
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
                                        .orderBy('dt_final', 'asc')
                                        .get();

        if(snapshot.empty) return res.status(200).json([]);

        const tasks = snapshot.docs.map( doc => ({id: doc.id, ...doc.data()}) );
        return res.status(200).json(tasks);
    } catch(error){
        console.error("Erro ao listar tarefas: ", error);
        return res.status(500).json({ error: "Erro interno" })
    }
}

// UPDATING ROOMS
exports.updateRoom = async (req, res)=> {
    try {
        const { roomId } = req.params; //gets the id of room
        const updates = req.body; // can have title, description, icon and/or config
        const userId = req.user.id; // get the user id

        // gets a reference of the room
        const roomRef = db.collection('room').doc(roomId);
        const doc = await roomRef.get();

        // check existence
        if (!doc.exists) return res.status(404).json({ error: "Sala não encontrada!" });

        // only the creator can edit the config
        if (doc.data().creatorUid !== userId) return res.status(403).json({ error: "Apenas o dono da sala pode editá-la" });

        // remove dangerous fields of body if exists
        delete updates.creatorUid;
        delete updates.id;

        await roomRef.update(updates); //update only the send fields

        return res.status(200).json({ message: "Sala atualizada com sucesso!" });
    } catch(error) {
        console.error("Erro updateRoom: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}

// UPDATING POSTS
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params; // gets the post id
        const updates = req.body; //get the updates 
        const userId = req.user.uid; //gets the user id

        //crete a reference of the collection
        const postRef = db.collection('posts').doc(postId); 
        const doc = await postRef.get();

        // checking the existence
        if (!doc.exists) return res.status(404).json({ error: "Post não encontrado." });

        // only the author of the post can update it
        if (doc.data().authorUid !== userId) return res.status(403).json({ error: "Você só pode editar seus próprios posts." });

        // upodates the date of modification
        updates.dt_updated = new Date();
        // cannot change the author
        delete updates.authorUid;

        // update the post
        await postRef.update(updates);

        return res.status(200).json({ message: "Post atualizado!" });
    } catch(error){
        console.error("Erro update post:", error);
        return res.status(500).json({ error: "Erro interno." });
    }
}

// UPDATING TASKS
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params; //gets the task id
        const updates = req.body; //gets the update
        
        // if has some date, change to Date()
        if (updates.dt_final) updates.dt_final = new Date(updates.dt_final);

        // create a reference of the task and update it
        const taskRef = db.collection('tasks').doc(taskId);
        await taskRef.update(updates);

        return res.status(200).json({ message: "Tarefa atualizada!" });
    } catch (error) {
        console.error("Erro update task:", error);
        return res.status(500).json({ error: "Erro interno." });
    }
}

// search POSTS (by word)
exports.searchGlobalPosts = async (req, res) => {
    try {
        const { q } = req.query; // gets ?q=word
        
        // checking existence
        if (!q) return res.status(400).json({ error: "Termo de busca obrigatório." });

        //create a reference to all posts
        const postsRef = db.collection('posts');
        
        //get all the posts
        const snapshot = await postsRef.get();
        const allPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // filter the posts
        const term = q.toLowerCase();
        const filteredPosts = allPosts.filter(post => {
            const titleMatch = post.title && post.title.toLowerCase().includes(term);
            // check if texts is an Array an if some text has the term
            const contentMatch = post.texts && Array.isArray(post.texts) && post.texts.some(t => t.toLowerCase().includes(term));
            
            return titleMatch || contentMatch;
        });

        return res.status(200).json(filteredPosts);

    } catch (error) {
        console.error("Erro na busca:", error);
        return res.status(500).json({ error: "Erro interno na busca." });
    }
}