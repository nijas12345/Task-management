import { InferSchemaType, Schema, Types, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["manager", "member"],
    default: "member",
  },
});

export type UserInput = InferSchemaType<typeof userSchema>;
export type UserDoc = UserInput & { _id?: Types.ObjectId };

const userModel = model<UserDoc>("User", userSchema);

export default userModel;
