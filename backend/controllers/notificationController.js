const { db } = require("../config/db");

exports.getMyNotifications = async (req, res) => {
    try {
        const uid = req.user.uid;
        
        const snapshot = await db.collection('notifications')
            .where('recipientUid', '==', uid)
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar notificações." });
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('notifications').doc(id).update({ read: true });
        return res.status(200).json({ message: "Lida." });
    } catch (error) {
        return res.status(500).json({ error: "Erro." });
    }
}