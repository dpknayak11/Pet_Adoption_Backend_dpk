const admin = require("../config/firebase");

// 🔔 Simple Send Notification Function
const sendNotification = async ({ fcmToken, title, body }) => {
  try {
    if (!fcmToken) {
      console.log("No FCM token found");
      return false;
    }
    const response = await admin.messaging().send({
      token: fcmToken,
      notification: {
        title,
        body,
      },
    });

    console.log("Firebase Response:", response);
    return true;
  } catch (error) {
    console.error("Notification Error:", error);
    return false;
  }
};

module.exports = sendNotification;
