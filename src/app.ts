import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';

import { AuthRouter } from './routes/auth.routes';
import { RetirosRoutes } from './routes/retiros.routes';
import { inventoryRouter } from './routes/inventario.routes';
import { ClientRouter } from './routes/clientes.routes';
import { PresupuestosRouter } from './routes/presupuestos.routes';
import { BuyOrdersRoutes } from './routes/buy-orders.routes';
import { ToolsRouter } from './routes/tools.routes';
import { ProjectRouter } from './routes/project.routes';
import { HomeBannerRouter } from './routes/home-banner.routes';
import { ContactPresupuestoRouter } from './routes/contactPresupuesto.routes';
import { PresentacionRouter } from './routes/presentacion.routes';

const app = express();

//* Configuration
app.set('port', process.env.PORT || 3000);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

//* Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(multer().array('imgFile'));

//* Routes
app.use('/portfolio/demos/dosmetal/api/auth', AuthRouter);
app.use('/portfolio/demos/dosmetal/api/inventory', inventoryRouter);
app.use('/portfolio/demos/dosmetal/api/retiros', RetirosRoutes);
app.use('/portfolio/demos/dosmetal/api/clientes', ClientRouter);
app.use('/portfolio/demos/dosmetal/api/presupuestos', PresupuestosRouter);
app.use('/portfolio/demos/dosmetal/api/orden-compras', BuyOrdersRoutes);
app.use('/portfolio/demos/dosmetal/api/tools', ToolsRouter);
app.use('/portfolio/demos/dosmetal/api/dosmetal-page/projects', ProjectRouter);
app.use('/portfolio/demos/dosmetal/api/dosmetal-page/homeBanner', HomeBannerRouter);
app.use('/portfolio/demos/dosmetal/api/dosmetal-page/contactPresupuesto', ContactPresupuestoRouter);
app.use('/portfolio/demos/dosmetal/api/dosmetal-page/presentacion', PresentacionRouter);

//* Start
export const server = () => {
	return app.listen(app.get('port'), () => {
		console.log(`Server listen on port: ${app.get('port')}`);
	});
};
