import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { Model } from "mongoose";
import { UserType } from "./usertype";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  userType: UserType | String;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<Error | boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface UserIDJwtPayload extends JwtPayload {
  userId: string;
}

export interface RequestWithUser extends Request {
  user: IUser;
}
