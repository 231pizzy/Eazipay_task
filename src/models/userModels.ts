import mongoose, { Schema } from 'mongoose';
import Joi from 'joi';

export interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;   
}

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name'],
    },
    email: {
      type: String,
      required: [true, 'Please enter your correct email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your first name'],
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;

export const validateUser = (user: Partial<IUser>) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
};
