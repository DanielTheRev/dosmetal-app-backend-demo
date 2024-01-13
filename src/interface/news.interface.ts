export interface News {
	_id?: string;
	title: string;
	description: string;
	images: { _id?: string; imgRef: Object | null }[];
}
