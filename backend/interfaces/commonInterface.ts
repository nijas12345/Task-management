import mongoose, { Types } from "mongoose";

export interface Projects {
  _id?: mongoose.Types.ObjectId;
  user_id: string;
  role: string;
  name: string;
  description: string;
  members: string[];
}

export interface CreateTaskDTO {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  assignee: string;
  projectId: Types.ObjectId;
  priority: "Low" | "Medium" | "High";
  status?: "Todo" | "In-Progress" | "Done";
  deadline: Date;
  activityLog: {
    user: string;
    action: string;
    timestamp: Date;
  }[];
}
