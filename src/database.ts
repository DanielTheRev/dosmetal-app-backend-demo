import { connect } from 'mongoose';
import { INITIAL_CONFIG } from './config';

export const connectDB = () => {
	connect(INITIAL_CONFIG.MONGO_DB.path)
		.then(() => {
			console.log(
				`database connected on ${
					INITIAL_CONFIG.MONGO_DB.production ? 'PRODUCTION' : 'DEVELOPMENT'
				}`
			);
		})
		.catch((reason) => {
			console.log('Error on connect to DB');
			console.log(reason);
		});
};
