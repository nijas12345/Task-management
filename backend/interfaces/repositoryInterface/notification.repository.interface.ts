import {
  NotificationDoc,
  NotificationInput,
} from "../../model/notificationModel";

export interface INotificationRepository {
  saveNotification(
    notificationData: Omit<NotificationInput, "createdAt" | "updatedAt">
  ): Promise<NotificationDoc>;

  getNotifications(user_id: string): Promise<NotificationDoc[]>;
  getAdminNotifications(user_id: string): Promise<NotificationDoc[]>;
  getNotificationsCount(user_id: string): Promise<NotificationDoc[]>;
  adminNotificationsCount(user_id: string): Promise<NotificationDoc[]>;
}
