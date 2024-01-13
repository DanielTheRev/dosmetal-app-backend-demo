import { Request, Response } from 'express';
import { DayEventModel } from '../models/Stock-Day-Event.model';
import {
	getMonthWithDayEventsRetiros,
	getTodayRetiros
} from '../services/retiros.service';

export const getMonths = async (req: Request, res: Response) => {
	const Months = await getMonthWithDayEventsRetiros();
	return res.json(Months);
};

export const getToday = async (req: Request, res: Response) => {
	const TodayEvents = await getTodayRetiros();
	return res.json(TodayEvents);
};

export const getEspecificDayRetiros = async (req: Request, res: Response) => {
	console.log('El usuario requirio un dia especifico de retiros');
	const dayEvents = await DayEventModel.find({
		DayID: req.body.ActualDay
	});

	return res.json(dayEvents);
};
