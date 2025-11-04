import { Model } from "mongoose";
import { INotificationRepository } from "../interfaces/repositoryInterface/notification.repository.interface";
import { NotificationDoc, NotificationInput } from "../model/notificationModel";
class NotificationRepository implements INotificationRepository {
  private notificationModel = Model<NotificationDoc>;
  constructor(notificationModel: Model<NotificationDoc>) {
    this.notificationModel = notificationModel;
  }
  saveNotification = async (
    notificationData: NotificationInput
  ): Promise<NotificationDoc> => {
    try {
      return await this.notificationModel.create(notificationData);
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotifications = async (user_id: string): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ assignedUserId: user_id,notificationType:"User" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminNotifications = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ user_id: user_id,notificationType:"Admin" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotificationsCount = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ assignedUserId: user_id, notificationType: "User" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
  adminNotificationsCount = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      return await this.notificationModel
        .find({ admin_id: admin_id, notificationType: "Admin" })
        .sort({ createdAt: -1 });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default NotificationRepository;
