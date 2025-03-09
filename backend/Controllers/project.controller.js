import projectModel from "../Models/project.model.js";
import userModel from '../Models/user.model.js'
import * as projectService from '../Services/project.service.js'



export const createProjectController = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    const email=req.user.email;
    const user= await userModel.findOne({email})
    const creator_id= user._id;
    const newProject = await projectService.createProjectService({ ...req.body, creator_id });

    res.status(201).json(newProject);
  } catch (err) {
    console.log(err.message)
    res.status(500).json(err.message);
  }
};

export const getAllProjectController= async (req,res)=>{
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const getProjectByIdController=async (req,res)=>{
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
}