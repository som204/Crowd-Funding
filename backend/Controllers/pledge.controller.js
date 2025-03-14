import * as pledgeService from "../Services/pledge.service.js";
import * as transactionService from "../Services/transaction.service.js";
import  projectModel from "../Models/project.model.js";

export const createPledgeController = async (req, res) => {
  try {
    const { project_id, backer_id , project_title, amount, order_id, payment_id, status } = req.body;
    const data = { project_id, backer_id, amount, project_title, order_id, payment_id, status };
    
    // Determine payment status
    const paymentStatus = status ? "SUCCESS" : "FAILED";
    
    // Save transaction
    const { reason, description,name } = req.body;
    const trans=await transactionService.createTransaction({ order_id, payment_id, backer_id, project_id, amount, paymentStatus, reason, description,name,project_title });
    // Create pledge
    const pledge = await pledgeService.createPledge(data);

    // Update Project
    const project = await projectModel.findById(project_id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (status) {
      project.current_amount += amount;
      project.backer_count += 1;
      project.checkProjectStatus(); 
      await project.save();
    }

    res.status(201).json(pledge);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};


export const getByProjectIdController = async (req, res) => {
  try {
    const pledge = await pledgeService.getPledgesByProjectId(req.params.id);
    if (pledge) {
      res.status(200).json(pledge);
    } else {
      res.status(404).json({ message: "Pledge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getByBackerIdController = async (req, res) => {
  try {
    const pledge = await pledgeService.getPledgesByBackerId(req.params.id);
    if (pledge) {
      res.status(200).json(pledge);
    } else {
      res.status(404).json({ message: "Pledge not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


