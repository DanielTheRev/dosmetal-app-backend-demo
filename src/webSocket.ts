import { Server, Socket } from 'socket.io';
import { InventoryModel } from './models/inventario-item.model';


export let SoConn: Server

export function WebSocketService(io: Server) {
	console.log('INTENTANDO CONECTAR A WEBSOCKET');
	io.on('connection', async (socket) => {
		SoConn = io;
		console.log(`User connected, id => ${socket.id}`);

		socket.on('[Inventory] inform inventory changes', async () => {
			console.log('[Inventory] INFORMANDO CAMBIOS EN EL INVENTARIO');
			const inventoryUpdated = await InventoryModel.find();
			socket.broadcast.emit('[Inventory] changes on inventory', inventoryUpdated);
		});

		//* RETIROS
		// emitTodayEvents();
		// emitMonthAndDaysEvents();

		socket.on('disconnect', () => {
			console.log(`User disconnected, id => ${socket.id}`);
		});
	});

}
