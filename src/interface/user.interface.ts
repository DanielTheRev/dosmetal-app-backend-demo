import { Model } from 'mongoose';

export interface IUser {
	UserName: string;
	Name: string;
	Gender: string;
	Password: string;
}

export interface IUserModel extends Model<IUser>, IUser {
	encryptPassword: (password: string) => Promise<any>;
	comparePassword: (password: string, receivedPassword: string) => Promise<any>;
}
