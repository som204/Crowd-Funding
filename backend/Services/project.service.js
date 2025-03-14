import projectModel from "../Models/project.model.js";

export const createProjectService = async (projectData) => {
    try {
      if (!projectData) {
        throw new Error("Value is Missing");
      }
      const newProject = await projectModel.create(projectData);
      return newProject;
    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  };
