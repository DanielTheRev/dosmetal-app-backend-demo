export interface ITool {
	_id?: string;
	Nombre: string;
	Marca: string;
	imgRef: any;
	Stock: {
		Fecha_Compra: string;
		Cantidad: number;
		Estado: string;
		Ubicacion: string;
	}[];
}
