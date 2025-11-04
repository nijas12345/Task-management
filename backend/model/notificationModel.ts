import mongoose, { Schema, InferSchemaType, model, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    user_id: {
      type: String,
      ref: "User",
      required: true,
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notificationType:{
      type: String,
      enum: ["Admin", "User"],
      required: true,
    }
  },
  { timestamps: true } // ✅ automatically adds createdAt & updatedAt
);

export type NotificationInput = InferSchemaType<typeof notificationSchema>;
export type NotificationDoc = NotificationInput & { _id: Types.ObjectId };

const NotificationModel = model<NotificationDoc>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
