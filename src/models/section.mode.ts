import { Schema, model } from 'mongoose';
import { Section } from '../interface/projects.interface';
import { projectSchema } from './project.model';

const sectionSchema = new Schema<Section>(
	{
		section: String,
		data: [projectSchema]
	},
	{
		versionKey: false
	}
);

export const sectionModel = model<Section>('Section', sectionSchema);
