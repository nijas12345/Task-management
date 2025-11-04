import { INotificationRepository } from "../interfaces/repositoryInterface/notification.repository.interface";
import { INotificationService } from "../interfaces/serviceInterface/notification.interface";
import { HttpError } from "../utils/httpError";
import HTTP_statusCode from "../enums/httpStatusCode";
import { NotificationDoc } from "../model/notificationModel";

class NotificationService implements INotificationService {
  private notificationRepository: INotificationRepository;
  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  getNotifications = async (user_id: string): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getNotifications(user_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getAdminNotifications = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getAdminNotifications(user_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  getNotificationsCount = async (
    user_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.getNotificationsCount(user_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
  adminNotificationsCount = async (
    admin_id: string
  ): Promise<NotificationDoc[]> => {
    try {
      const notificationData: NotificationDoc[] =
        await this.notificationRepository.adminNotificationsCount(admin_id);
      if (!notificationData) {
        throw new HttpError(
          HTTP_statusCode.NotFound,
          "No notifications are available"
        );
      }
      return notificationData;
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default NotificationService;
