export interface IBuyOrder {
	CompanyName: string;
	Date: string;
	OrderNo: number;
	OrderTo: IOrderTo;
	Products: IProductOrder[];
}

export interface IProductOrder {
	Product: string;
	Amount: number;
}

export interface IOrderTo {
	ClientName: string;
	Adress: string;
	Telephone: string;
}
