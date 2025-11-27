const { db } = require("../config/db"); //gets the firestore
const { sendNotification } = require("../utils/notificationHelper");

// create a new post in a class
// route: POST /api/content/posts
exports.createPost = async (req, res)=> {
    try {
        // receives the author uid 
        const authorUid = req.user.uid;
    
        //gets the nome of token 
        const username = req.user.name;

        const { title, classId, texts, images, marker } = req.body;

        if(!title ||  !classId || !texts) return res.status(400).json({ error: "Campos 'title', 'classId' e 'texts' são obrigatórios!" });

        const postData = {
            title,
            classId,
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


// list all posts of an specific class
// route: GET /api/content/classs/:classId/posts
exports.getPostsForClass = async (req, res) => {
    try {
        // get the class's id
        const { classId } = req.params;

        // gets a reference of collecion posts
        const postsRef = db.collection('posts');

        // get the posts referenced by the classId
        const snapshot = await postsRef.where('classId', '==', classId)
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

// create a new task in a class
// route: POST /api/content/tasks
exports.createTask = async (req, res) => {
    try {
        // the dt_final needs to come in a string ISO
        const { title, classId, dt_final } = req.body;

        if(!title || !classId || !dt_final) return res.status(400).json({ error: "Campos 'title', 'classId' e 'dt_final' são obrigatórios!" })

        const taskData = {
            title,
            classId,
            dt_final: new Date(dt_final),
            finishedBy: []
        };

        const newTaskRef = await db.collection('tasks').add(taskData);

        //gets the class members
        const classDoc = await db.collection.doc(classId).get();

        if(classDoc.exists){
            const members = classDoc.data().membersId || [];

            members.forEach(memberUid => {
                if(memberUid !== req.user.uid){
                    sendNotification(memberUid, "Nova Tarefa", `Tarefa ${title} criada na sala.`, "task");
                }
            })
        }

        return res.status(201).json({
            message: "Tarefa criada com sucesso!",
            taskId: newTaskRef.id
        });
    } catch(error){
        console.error("Erro ao criar a tarefa: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}

// get all tasks of an specific class
// route: GET /api/contnet/classs/:classId/tasks
exports.getTasksForClass = async (req, res) => {
    try {
        const { classId } = req.params;
 
        // create a reference of taskRef and get the tasks of class
        const taskRef = db.collection('tasks');
        const snapshot = await taskRef.where('classId', '==', classId)
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

// search POSTS
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

exports.searchPostsByTags = async (req, res) => {
    try{
        const { tag } = req.query;

        if (!tag) return res.status(400).json({ error: "Tag obrigatória" });

        const postRef = db.collection('posts');
        const snapshot = await postRef.where('tags', 'array-contains', tag.toLowerCase())

        if (snapshot.empty) return res.status(200).json([]);

        const posts = snapshot.docs.map(doc => ( { id: doc.id, ...doc.data() } ));

        return res.status(200).json(posts);
    } catch(error){
        console.error("Erro ao buscar tags: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}

exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.uid;

        const postRef = db.collection('classes').doc(postId);
        const doc = await postRef.get();

        if(!doc.exists) return res.status(404).json({ error: "Sala não encontrada!" });

        if(doc.data().creatorUid !== userId) return res.status(403).json({ error: "Sem permissão!" });

        await postRef.delete();

        return res.status(200).json({ message: "Sala deletada!" });
    } catch(error){
        console.error("Erro ao deletar sala: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}

exports.deleteTask = async(req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.uid;

        const taskRef = db.collection('classes').doc(taskId);
        const doc = await taskRef.get();

        if(!doc.exists) return res.status(404).json({ error: "Sala não encontrada!" });

        if(doc.data().creatorUid !== userId) return res.status(403).json({ error: "Sem permissão!" });

        await taskRef.delete();

        return res.status(200).json({ message: "Sala deletada!" });
    } catch(error){
        console.error("Erro ao deletar sala: ", error);
        return res.status(500).json({ error: "Erro interno!" });
    }
}