import { Schema, InferSchemaType, model, Types } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export type ProjectInput = InferSchemaType<typeof projectSchema>;
export type ProjectDoc = ProjectInput & { _id: Types.ObjectId };

const ProjectModel = model<ProjectDoc>("Project", projectSchema);

export default ProjectModel;
