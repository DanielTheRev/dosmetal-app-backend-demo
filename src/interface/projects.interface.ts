import { Types } from 'mongoose';

export interface Section {
	id?: string;
	section: string;
	data: Types.DocumentArray<Project>;
}

export interface Project extends Types.Subdocument{
	id?: string;
	ProjectDate: Date;
	isLastProject: boolean;
	ProjectTitle: string;
	ProjectDescription: string;
	ProjectImgs: any[];
}
