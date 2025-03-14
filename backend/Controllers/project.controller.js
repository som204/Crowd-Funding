import projectModel from "../Models/project.model.js";
import userModel from '../Models/user.model.js'
import * as projectService from '../Services/project.service.js'
import * as paymentService from '../Services/razorpay.service.js';



export const createProjectController = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }
    const email = req.user.email;
    const created_by = req.user.name;
    const user = await userModel.findOne({ email });
    const creator_id = user._id;

    // Call the payment service to create a fund account ID
    const { account_name, account_number, ifsc } = req.body.bank_details;
    const contactId = user.contact_id;
    const fundAccountId = await paymentService.createFundAccount(
      contactId, 
      account_number, 
      ifsc, 
      account_name 
    );

    // Deconstruct the payload from the request body
    const { title, description, goal_amount, end_at, category, image } = req.body;

    // Create the project with the fund account ID
    const newProject = await projectService.createProjectService({ 
      title,
      description,
      goal_amount: parseFloat(goal_amount),
      end_at,
      category,
      image,
      creator_id,
      created_by,
      fund_account_id: fundAccountId.id,
      created_at: Date.now(),
      bank_details: {
        account_holder_name: account_name,
        account_number,
        ifsc_code: ifsc
      }
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.log(err.message);
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

export const getByCreatorIdController=async (req,res)=>{
  try {
    const project = await projectModel.find({creator_id:req.params.id});
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export const getByProjectIdController=async (req,res)=>{
  try {
    const project = await projectModel.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
}