import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, IUserModel } from '../interface/user.interface';

export const UserSchema = new Schema<IUser>(
	{
		UserName: {
			type: String,
			unique: true
		},
		Name: String,
		Gender: {
			type: String,
			required: true
		},
		Password: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false,
		timestamps: false
	}
);

UserSchema.statics.encryptPassword = async (Password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(Password, salt);
};

UserSchema.statics.comparePassword = async (password, receivedPassword) => {
	return await bcrypt.compare(password, receivedPassword);
};

UserSchema.pre('save', async function (next) {
	const user = this;
	if (!user.isModified('password')) {
		return next();
	}
	const hash = await bcrypt.hash(user.Password, 10);
	user.Password = hash;
	next();
});

export const UserModel = model<IUser, IUserModel>('User', UserSchema);
