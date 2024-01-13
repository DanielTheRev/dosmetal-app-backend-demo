import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { INITIAL_CONFIG } from '../config';

export const tokenValidation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header('Authorization')?.split(' ')[1];

		if (!token) return res.status(401).json('No token provided');

		const decoded = jwt.verify(token, INITIAL_CONFIG.SECRET_KEY) as { userID: string };
		const user = UserModel.findById(decoded.userID);

		if (!user) return res.status(401).json({ message: 'user not found' });
		req.userId = decoded.userID;
		next();
	} catch (error) {
		return res.status(401).json({ message: 'token expired' });
	}
};
