import { NotificationDoc } from "../../model/notificationModel";

export interface INotificationService{
    getNotifications(user_id:string):Promise<NotificationDoc[]>
    getAdminNotifications(user_id:string):Promise<NotificationDoc[]>
    getNotificationsCount(user_id:string):Promise<NotificationDoc[]>
    adminNotificationsCount(user_id:string):Promise<NotificationDoc[]>   
}