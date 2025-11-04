import { Schema, model, Types, InferSchemaType } from "mongoose";

const activityLogSchema = new Schema(
  {
    user: { type: String, required: true }, 
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
      trim: true,
    },
    assignee: {
      type: String,
      required: [true, "Assignee email is required"],
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "inprogress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    activityLog: [activityLogSchema],
  },
  { timestamps: true }
);

// 🧾 Type Definitions
export type TaskInput = InferSchemaType<typeof taskSchema>;
export type TaskDoc = TaskInput & { _id: Types.ObjectId };

// 🧱 Model
const TaskModel = model<TaskDoc>("Task", taskSchema);

export default TaskModel;
