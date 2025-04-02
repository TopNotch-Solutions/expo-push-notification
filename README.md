NB: https://expo.dev/notifications is used to test push notification with expo

1. Go to firebase console
2. Create a project
3. Go to project settings
4. Generate new private key NB: don't loose it.
5. Install expo-cli using: npx eas-cli
6. Intial the project using: npx eas-cli init
7. build the development build using: npx eas-cli build:configure
8. Run npx eas-cli credentials
9. Select platform
10. Add package for Android and bundleIdentifier, e.g. com.paulo_devops.pushnotifications
11. Select Google server account
12. Select Manage your Google Service Account Key for Push Notifications (FCM V1)
13. Select Set up a Google Service Account Key for Push Notifications (FCM V1)
14. Place the expo-push-notification.json file in the root directory.
15. Add the path to the file ./expo-push-notifications-21df7-firebase-adminsdk-fbsvc-f7d5708256.json
16. Go to the general section on firebase and select android
17. Register your app NB: Debug signing certificate SHA-1, To get it you need to trigger a new build using: npx eas-cli build --platform android
18. Get the fingerprint
19. Download the goolge-service.json and add it into the root level of the project
20. Add the google-services.json in the gitignore file and add /iso and /android as well
21. Create a easignore file and copy the content from the gitignore file but remove the google-services.json
22. In the app.json add "googleServicesFile":"./google-services.json"

We are ready to send push notification at this stage:::::::::

23. npx expo install expo-notifications expo-device expo-constants
24. Create two folders context and utils
25. In the utils create a file called registerForPushNotificationsAsync

NB: Once you are done with configuration build the app again using npx eas-cli build --platform android --profile development


Sending push notification using expo push notificatio controller:

const { Expo } = require("expo-server-sdk");

// Create a new Expo SDK client
const expo = new Expo();

async function sendPushNotification(expoPushToken, message, data = {}) {
    // Check if the push token is valid
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(`Invalid Expo push token: ${expoPushToken}`);
        return;
    }

    // Construct the message
    const messages = [
        {
            to: expoPushToken,
            sound: "default", // Notification sound
            title: "New Notification!", // Title of the notification
            body: message, // Body text
            data: data, // Additional data payload
        },
    ];

    try {
        // Send the notification
        const ticket = await expo.sendPushNotificationsAsync(messages);
        console.log("Push notification sent:", ticket);
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
}

const expoPushToken = "ExponentPushToken[Lq88PbG5Tf1xLJjxyGCz1c]";
sendPushNotification(expoPushToken, "Hello! This is a test notification.", { screen: "home" });

module.exports = { sendPushNotification };
