import { Request, Response } from 'express';
import { ContactCard } from '../interface/contactCard.interface';
import { ContactCardModel } from '../models/contactCard.model';

export const getContactCard = async (req: Request, res: Response) => {
	const contactCard = await ContactCardModel.find();

	return res.json(contactCard);
};

export const postContactCard = async (req: Request, res: Response) => {
	const DTO = req.body as ContactCard;

	const newContactCard = new ContactCardModel(DTO);

	const ContactCardSaved = await newContactCard.save();

	return res.json({ message: 'Guardado' });
};
