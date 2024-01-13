import { Request, Response } from 'express';
import { Project, Section } from '../interface/projects.interface';
import { sectionModel } from '../models/section.mode';
import { DeleteImage, UploadImage } from '../services/cloudinary.service';

export const getSections = async (req: Request, res: Response) => {
	const sections = await sectionModel.find();
	const sectionMenu = sections.map((e) => {
		return { _id: e._id, section: e.section };
	});
	return res.json(sectionMenu);
};
export const getSectionData = async (req: Request, res: Response) => {
	const section = await sectionModel.findOne({ section: req.body.section });
	if (!section) return res.json([]);
	section.data.sort((a: any, b: any) => b.isLastProject - a.isLastProject);
	return res.json(section);
};

export const addSections = async (req: Request, res: Response) => {
	const DTO = req.body as { section: string };
	const section: Section = {
		...DTO,
		data: [] as any
	};
	const newSection = new sectionModel(section);
	const sectionSaved = await newSection.save();
	return res.json(sectionSaved);
};

export const getProject = async (req: Request, res: Response) => {
	const DTO = req.body as { section: string; _id: string };

	const section = await sectionModel.findOne({ section: DTO.section });
	if (!section) {
		return res.json({ status: 'parece que no existe esa seccion' });
	}

	const project = section.data.id(DTO._id);

	return res.json({ status: 'ok', project });
};

export const addProject = async (req: Request, res: Response) => {
	const DTO = req.body as { section: string; data: string };
	const files = req.files as any[];
	const Section = await sectionModel.findOne({ section: DTO.section });
	if (!Section) {
		return res.json({ status: 'Esa secction parece no existir...' });
	}

	let projectReceived = JSON.parse(DTO.data) as Project;
	projectReceived.ProjectImgs = [];

	if (files.length > 0) {
		for await (const image of files) {
			const img_ref = await UploadImage(image, image.originalName, DTO.section);
			projectReceived.ProjectImgs.push(img_ref);
		}
	}

	if (projectReceived.isLastProject) {
		const actualLastProject = Section.data.findIndex((e) => e.isLastProject);
		if (actualLastProject !== -1) {
			Section.data[actualLastProject].isLastProject = false;
		}
	}
	Section.data.push(projectReceived);
	const SectionSaved = await Section.save();
	return res.json({ status: 'terminado', projectSaved: projectReceived });
};

export const updateProject = async (req: Request, res: Response) => {
	const DTO = req.body as { sectionID: string; project: string };
	const projectDTO = JSON.parse(DTO.project) as Project;
	const files = req.files as any[];

	const Section = await sectionModel.findById(DTO.sectionID);
	if (!Section) {
		return res.json({ status: 'Esa seccion parece no existir...' });
	}

	const project = Section.data.id(projectDTO._id);

	if (!project) {
		return res.json({
			status: false,
			message: 'Es posible que la obra que quieras editar no exista'
		});
	}
	project.ProjectTitle = projectDTO.ProjectTitle;
	project.ProjectDescription = projectDTO.ProjectDescription;
	if (projectDTO.isLastProject) {
		const actualLastProject = Section.data.findIndex((e) => e.isLastProject);
		if (actualLastProject !== -1) {
			Section.data[actualLastProject].isLastProject = false;
		}
	}
	project.isLastProject = projectDTO.isLastProject;
	if (files.length > 0) {
		for await (const image of files) {
			const img_ref = await UploadImage(image, image.originalName, Section.section);
			project.ProjectImgs.unshift(img_ref);
		}
	}
	try {
		const projecUpdated = await Section.save();
		return res.json({
			status: true,
			message: 'Obra actualizada',
			projectSaved: project.toObject()
		});
	} catch (error) {
		return res.json({
			status: false,
			message: 'Ocurrio un error al actualizar proyecto'
		});
	}
};

export const deleteProjectFromSection = async (req: Request, res: Response) => {
	const params = req.params as { sectionID: string; projectID: string };
	const section = await sectionModel.findById(params.sectionID);

	if (!section) return res.json({ status: false, message: 'no se encontro seccion' });
	const project = section.data.id(params.projectID);
	if (!project) return res.json({ status: false, message: 'no existe ese proyecto' });
	for await (const img of project?.ProjectImgs) {
		await DeleteImage(img.public_id);
	}
	project.deleteOne();
	await section.save();
	return res.json({ status: true, message: 'Projecto eliminado correctamente' });
};

export const deleteImgFromProject = async (req: Request, res: Response) => {
	const DTO = req.body as { public_id: string; sectionID: string; projectID: string };

	const section = await sectionModel.findById(DTO.sectionID);

	if (!section) {
		return res.json({ status: false, message: 'seccion no encontrada' });
	}

	const project = section.data.id(DTO.projectID);

	if (!project) {
		return res.json({ status: false, message: 'No se encuentra el proyecto' });
	}

	await DeleteImage(DTO.public_id);

	project.ProjectImgs = project.ProjectImgs.filter((e) => e.public_id !== DTO.public_id);

	await section.save();

	return res.json({ status: true, message: 'Imagen eliminada correctamente' });
};
