import { Request, Response } from 'express';
import { IInventory, IInventoryItem, IRetiro } from '../interface/inventory.interface';
import { InventoryModel } from '../models/inventario-item.model';
import { registerRetiro } from '../services/retiros.service';
import { UploadImage } from '../services/cloudinary.service';

export const getAllInventory = async (req: Request, res: Response) => {
	try {
		const inventory = await InventoryModel.find();

		return res.json(inventory);
	} catch (error) {
		return res.status(500).json({ message: 'Error al enviar el inventario' });
	}
};

export const AddInventory = async (req: Request, res: Response) => {
	const itemToAdd = JSON.parse(req.body.itemToAdd);
	const itemReferenceAndNumber = await assignNumber(itemToAdd.Categoria.letra);
	const files = req.files as Express.Multer.File[];

	const newItem: IInventory = {
		...itemToAdd,
		NumeroAsignado: itemReferenceAndNumber.numero,
		Referencia: itemReferenceAndNumber.referencia,
		ImgRef: req.file?.filename
	};
	const itemToSave = new InventoryModel(newItem);
	if (files && files[0]) {
		console.log('Hay una imagen para agregar');
		const img_uploaded = await UploadImage(
			files[0],
			itemToSave._id!,
			'dosmetal-app-demo/Inventory-images'
		);
		itemToSave.ImgRef = img_uploaded;
	}
	itemToSave.Inventario = SortInventory(itemToSave.Inventario);
	try {
		await itemToSave.save();
		return res.json({
			status: true,
			message: 'Inventario guardado con exito',
			item: itemToSave
		});
	} catch (error) {
		return res.json({
			status: true,
			message: 'Fallo al guardar el inventario',
			item: {}
		});
	}
};

export const editInventory = async (req: Request, res: Response) => {
	const item = JSON.parse(req.body.itemToAdd) as IInventory;
	const itemToModify = await InventoryModel.findById(item._id);
	if (!itemToModify) return res.status(500).json({ message: 'No existe item' });
	if (req.file) {
		const img_uploaded = await UploadImage(req.file, item._id!, 'Inventory-images');
		item.ImgRef = img_uploaded;
	}

	try {
		const itemUpdated = await InventoryModel.findByIdAndUpdate(item._id, item, {
			new: true
		});
		itemUpdated!.Inventario = SortInventory(itemUpdated!.Inventario);
		const itemSaved = await itemUpdated!.save();
		return res.json({
			item: itemSaved,
			message: 'Inventario modificado con exito'
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error al guardar inventario' });
	}
};

export const removeFromInventory = async (req: Request, res: Response) => {
	const retiro = req.body as IRetiro;

	for await (const [index, itemRetirado] of retiro.itemsRetirados.entries()) {
		const item = await InventoryModel.findOne({
			_id: itemRetirado._id,
			Referencia: itemRetirado.referencia
		});
		if (!item) return;

		let CantidadRequerida = itemRetirado.retiro.cantidadQueRetira;
		console.log(`Se requieren retirar ${CantidadRequerida} unidades`);
		const newStock = DiscountStock(CantidadRequerida, item.toObject().Inventario);
		item.Inventario = newStock;
		// * calculando total de inventario
		const StockState = CalculateTotalInventory(newStock, item.Cant_poco_stock);
		item.InventoryState = StockState.StockState;
		item.TotalInventario = StockState.StockTotal;
		try {
			await item.save();
			if (index === retiro.itemsRetirados.length - 1) {
				await registerRetiro(retiro);

				return res.json({
					status: true,
					message: 'Unidades retiradas correctamente'
				});
			}
		} catch (error) {
			return res.status(500).json({ status: false, message: 'Error al retirar las unidades' });
		}
	}
};

export const addToInventory = async (req: Request, res: Response) => {
	const data = req.body as {
		reference: string;
		newStock: IInventoryItem[];
		_id: string;
	};
	const item = await InventoryModel.findById(data._id);

	if (!item)
		return res.json({
			status: false,
			message: 'No existe el item o aun no esta cargado'
		});

	data.newStock.forEach((stock) => {
		const stockIDX = item.Inventario.findIndex(
			(e) => e.tipo_contenedor === stock.tipo_contenedor
		);
		if (stockIDX !== -1) {
			const itemFound = item.Inventario[stockIDX];
			if (['Caja', 'Bolsa'].includes(itemFound.tipo_contenedor)) {
				if (itemFound.unidades_en_contenedor === stock.unidades_en_contenedor) {
					item.Inventario[stockIDX].cantidad_de_contenedor += stock.cantidad_de_contenedor;
					return;
				}
				item.Inventario.push(stock);
				return;
			}
			itemFound.unidades_en_contenedor += stock.unidades_en_contenedor;

			return;
		} else {
			item.Inventario.push(stock);
		}
	});

	let stockTotal = 0;
	item.Inventario.forEach((inventory) => {
		const cuenta = inventory.unidades_en_contenedor * inventory.cantidad_de_contenedor;
		stockTotal += cuenta;
	});

	switch (true) {
		case stockTotal < item.Cant_poco_stock && stockTotal > 0:
			item.InventoryState = 'Poco Stock';
			break;
		case stockTotal === 0:
			item.InventoryState = 'Sin Stock';
			item.TotalInventario = 0;
			break;
		default:
			item.InventoryState = 'Stock Suficiente';
			break;
	}
	item.TotalInventario = stockTotal;

	try {
		item.Inventario = SortInventory(item.Inventario);
		await item.save();
		return res.json({
			status: true,
			message: 'Stock cargado correctamente',
			newStock: item
		});
	} catch (error) {
		return res.json({
			status: false,
			message: 'Ocurrio un error al actualizar el stock'
		});
	}
};

export const deleteInventory = async (req: Request, res: Response) => {
	const itemID = req.params._id;
	const itemToDelete = await InventoryModel.findById(itemID);
	if (!itemToDelete) return res.json({ status: false, message: 'No existe tal documento' });

	try {
		await itemToDelete.deleteOne();
		return res.json({ status: true, message: 'Inventario eliminado con éxito' });
	} catch (error) {
		return res.json({ status: false, message: 'Error al eliminar del inventario' });
	}
};

export const getLowStock = async (req: Request, res: Response) => {
	const inventory = await InventoryModel.find();
	const lowStock = inventory.filter((e) => e.InventoryState === 'Poco Stock');

	return res.json({ data: lowStock });
};

export const changeMinumumUnitsRequired = async (req: Request, res: Response) => {
	const minimum = req.body.newMinumum;
	const itemID = req.body.itemID;

	const item = await InventoryModel.findById(itemID);

	if (!item) return res.status(404).json({ message: 'No existe el item a modificar' });

	item.Cant_poco_stock = minimum;
	//* EVALUANDO Y SETEANDO EL ESTADO DEL INVENTARIO
	switch (true) {
		case item.TotalInventario <= minimum && item.TotalInventario > 0:
			item.InventoryState = 'Poco Stock';
			break;
		case item.TotalInventario === 0:
			item.InventoryState = 'Sin Stock';
			item.TotalInventario = 0;
			break;
		default:
			item.InventoryState = 'Stock Suficiente';
			break;
	}

	try {
		await item.save();
		return res.json({
			message: 'Monto minimo actualizado con exito',
			itemWithChanges: item.toJSON()
		});
	} catch (error) {
		res.status(500).json({ message: 'Error al actualizar item' });
	}
};

export const getInventoryHistory = async (req: Request, res: Response) => {
	const inventoryID = req.params._id;
	const inventoryItem = await InventoryModel.findById(inventoryID);

	if (!inventoryItem) return res.json({ data: null });

	return res.json(inventoryItem.Historial);
};

//* HELPERS
async function assignNumber(letter: string) {
	const inventory = await InventoryModel.find();

	const itemsWithThisLetter = inventory.filter((e) => e.Categoria.letra === letter);

	if (itemsWithThisLetter.length > 0) {
		itemsWithThisLetter.sort((a, b) => a.NumeroAsignado - b.NumeroAsignado);
		let referencia: string = '';
		const itemNro = itemsWithThisLetter[itemsWithThisLetter.length - 1].NumeroAsignado + 1;
		switch (true) {
			case itemNro.toString().length === 1:
				referencia = `${letter}-000${itemNro}`;
				break;
			case itemNro.toString().length === 2:
				referencia = `${letter}-00${itemNro}`;
				break;
			case itemNro.toString().length === 3:
				referencia = `${letter}-0${itemNro}`;
				break;
			case itemNro.toString().length === 4:
				referencia = `${letter}-${itemNro}`;
				break;
			default:
				break;
		}
		return { numero: itemNro, referencia };
	}
	const itemNro = 1;
	const referencia = `${letter}-0001`;
	return { numero: itemNro, referencia };
}

const CalculateTotalInventory = (Inventory: IInventoryItem[], StockMinimo: number) => {
	let stockTotal = 0;
	let state = '';
	Inventory.forEach((inventory) => {
		if (inventory.tipo_contenedor === 'Unidades sueltas') {
			stockTotal += inventory.unidades_en_contenedor;
			return;
		}
		const cuenta = inventory.unidades_en_contenedor * inventory.cantidad_de_contenedor;
		stockTotal += cuenta;
	});
	console.log(`El stock minimo es de ${StockMinimo} unidades`);
	switch (true) {
		case stockTotal < StockMinimo && stockTotal > 0:
			state = 'Poco Stock';
			break;
		case stockTotal === 0:
			state = 'Sin Stock';
			break;
		default:
			state = 'Stock Suficiente';
			break;
	}

	return { StockTotal: stockTotal, StockState: state };
};

const SortInventory = (Inventory: IInventoryItem[]) => {
	const notUnidadesSueltas = Inventory.filter((e) => e.tipo_contenedor !== 'Unidades sueltas')
		.sort((a, b) => {
			if (a.esta_abierto) return 1;
			return -1;
		})
		.sort((a, b) => (a.unidades_en_contenedor < b.unidades_en_contenedor ? 1 : -1));

	const unidadesSueltas = Inventory.filter((e) => e.tipo_contenedor === 'Unidades sueltas').sort(
		(a, b) => {
			return a.cantidad_de_contenedor > b.cantidad_de_contenedor ? 1 : -1;
		}
	);

	return [...notUnidadesSueltas, ...unidadesSueltas];
};

const DiscountStock = (CantidadRequerida: number, stockData: IInventoryItem[]) => {
	let stock = [...stockData];
	stock = SortInventory(stock);
	stock = stock.reduceRight((acc, item) => {
		//Empezando a descontar stock
		if (CantidadRequerida > 0) {
			if (item.tipo_contenedor === 'Unidades sueltas') {
				if (item.unidades_en_contenedor === CantidadRequerida) {
					CantidadRequerida = 0;
					return acc;
				}

				if (item.unidades_en_contenedor > CantidadRequerida) {
					item.unidades_en_contenedor -= CantidadRequerida;
					CantidadRequerida = 0;
					acc.push(item);
					return acc;
				}

				if (item.unidades_en_contenedor < CantidadRequerida) {
					CantidadRequerida -= item.unidades_en_contenedor;
					return acc;
				}
			}
			if (item.cantidad_de_contenedor === 1) {
				// console.log('Tiene solo un item');
				if (item.unidades_en_contenedor > CantidadRequerida) {
					if (item.esta_abierto) {
						item.unidades_en_contenedor -= CantidadRequerida;
						CantidadRequerida = 0;
						acc.push(item);
						return acc;
					}

					item.unidades_en_contenedor -= CantidadRequerida;
					item.esta_abierto = true;
					CantidadRequerida = 0;
					acc.push(item);
					return acc;
				}

				if (item.unidades_en_contenedor < CantidadRequerida) {
					CantidadRequerida -= item.unidades_en_contenedor;
					return acc;
				}

				if (item.unidades_en_contenedor === CantidadRequerida) {
					CantidadRequerida = 0;
					return acc;
				}
			}
			// console.log('Tiene mas de 1 stock');
			while (item.cantidad_de_contenedor > 1 || CantidadRequerida > 0) {
				if (item.unidades_en_contenedor > CantidadRequerida) {
					// console.log('Es mayor a lo requerido');
					if (item.esta_abierto) {
						item.unidades_en_contenedor -= CantidadRequerida;
						CantidadRequerida = 0;
						acc.push(item);
						return acc;
					}
					item.cantidad_de_contenedor -= 1;
					acc.push(item);
					const newBox: IInventoryItem = {
						...item,
						cantidad_de_contenedor: 1
					};
					newBox.unidades_en_contenedor -= CantidadRequerida;
					CantidadRequerida = 0;
					newBox.esta_abierto = true;
					acc.push(newBox);
					return acc;
				}
				if (item.unidades_en_contenedor < CantidadRequerida) {
					// console.log('Es menor a lo requerido');
					item.cantidad_de_contenedor -= 1;
					CantidadRequerida -= item.unidades_en_contenedor;
					item.esta_abierto = true;
					item.unidades_en_contenedor -= CantidadRequerida;
					if (item.unidades_en_contenedor > 0) {
						acc.push(item);
					}
					return acc;
				}
				if (item.unidades_en_contenedor === CantidadRequerida) {
					// console.log('Es igual a lo requerido');
					item.cantidad_de_contenedor -= 1;
					CantidadRequerida = 0;
					acc.push(item);
					return acc;
				}
			}
		}
		if (item.unidades_en_contenedor > 0) {
			acc.unshift(item);
		}
		return acc;
	}, [] as IInventoryItem[]);

	return stock;
};
