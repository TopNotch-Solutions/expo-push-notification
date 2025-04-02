import React, { createContext, useContext, useState, useEffect, useRef, ReactNode} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { useRouter } from "expo-router";


type Subscription = Notifications.Subscription;

interface NotificationContextType{
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () =>{
    const context = useContext(NotificationContext);
    if(context === undefined){
        throw new Error("useNotification must be used within a notification provider");
    }
    return context;
};

interface NotificationProviderProps{
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> =({children}) =>{
    const router = useRouter();
    const [expoPushToken ,setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notifications.Notification| null>(null);
    const [error ,setError] = useState<Error | null>(null);

    const notificationListener = useRef<Subscription | null>();
    const responseListener = useRef<Subscription | null>();

    useEffect(() =>{
        const getPushToken = async () => {
            try {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                    setExpoPushToken(token);
                }
            } catch (error) {
                setError(error as Error);
            }
        };
    
        getPushToken();

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) =>{
            console.log("Notification received while running: ",notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) =>{
            console.log("Notification response user interacts", JSON.stringify(response, null, 2), JSON.stringify(response.notification.request.content.data));

            //handle the notification response here
            if(response.notification.request.content.data.data === "Make a wish"){
                router.push("/explore");
            }else{
                router.push("/");
            }
        });

        return () =>{
            if(notificationListener.current){
                Notifications.removeNotificationSubscription(notificationListener.current)
            }
            if(responseListener.current){
                Notifications.removeNotificationSubscription(responseListener.current)
            }
        }
    },[]);

    return (
        <NotificationContext.Provider value={{expoPushToken, notification, error}}>
            {children}
        </NotificationContext.Provider>
    )
}