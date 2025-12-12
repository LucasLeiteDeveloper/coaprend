const { db } = require("../config/db");

// create a notification on firestore to an user
exports.sendNotification = async (reqcipientUid, title, message, type = 'info') => {
    try {
        await db.collection('notifications').add({
            reqcipientUid,
            title,
            message,
            type,
            read: false,
            createdAt: new Date()
        });
        console.log(`Notificação enviada para ${reqcipientUid}`)
    } catch(error) {
        console.error("Erro ao enviar notificação: ", error);
    }
}