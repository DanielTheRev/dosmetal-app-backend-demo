import { Schema, model } from 'mongoose';
import { Project } from '../interface/projects.interface';

export const projectSchema = new Schema<Project>(
	{
		isLastProject: Boolean,
		ProjectDate: Date,
		ProjectTitle: String,
		ProjectDescription: String,
		ProjectImgs: [{}]
	},
	{
		versionKey: false
	}
);
