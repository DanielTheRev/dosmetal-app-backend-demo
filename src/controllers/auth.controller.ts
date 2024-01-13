import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { INITIAL_CONFIG } from '../config';

export const registerUser = async (req: Request, res: Response) => {
	const userDTO = req.body;
	try {
		const newUser = new UserModel(userDTO);
		newUser.Password = await UserModel.encryptPassword(userDTO.Password);
		const savedUser = await newUser.save();
		return res.json({
			UserName: savedUser.UserName,
			Name: savedUser.Name
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error al crear usuario' });
	}
};

export const LogIn = async (req: Request, res: Response) => {
	const userDTO = req.body as { UserName: string; Password: string };
	const user = await UserModel.findOne({ UserName: userDTO.UserName });
	if (!user)
		return res
			.status(402)
			.json({ message: 'No existe usuario o contraseña incorrecta' });
	const matchPassword = await UserModel.comparePassword(userDTO.Password, user.Password);

	if (matchPassword) {
		const token = jwt.sign({ userID: user.id }, INITIAL_CONFIG.SECRET_KEY, {
			expiresIn: '10 hrs'
			// expiresIn: '5s'
		});
		console.log(token);

		return res.json({
			UserName: user.UserName,
			Name: user.Name,
			Gender: user.Gender,
			token
		});
	}

	return res.status(402).json({ message: 'No existe usuario o contraseña incorrecta' });
};

export const VerifyUserToken = async (req: Request, res: Response) => {
	const token = req.body.token;
	if (!token) return res.status(401).json({ valid: false });

	try {
		const decoded = jwt.verify(token, INITIAL_CONFIG.SECRET_KEY) as { userID: string };
		const user = await UserModel.findById(decoded.userID);
		return res.json({ valid: true, user });
	} catch (error) {
		return res.status(401).json({ valid: false });
	}
};

export const GetUserProfile = async (req: Request, res: Response) => {
	const user = await UserModel.findById(req.userId);

	if (!user) return res.status(401).json({ message: 'El usuario solicitado no existe' });

	return res.json({
		Name: user.Name,
		Gender: user.Gender,
		UserName: user.UserName
	});
};
