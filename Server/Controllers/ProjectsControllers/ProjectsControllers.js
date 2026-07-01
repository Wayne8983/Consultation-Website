const mongoose = require("mongoose");
const Client = require("../../Models/Clients/Client.model");
const Project = require("../../Models/Projects/projectsModel");


const normalizeMilestones = (milestones) => {
  if (!Array.isArray(milestones)) return [];

  return milestones
    .map((milestone) => ({
      title: milestone.title?.trim(),
      description: milestone.description?.trim() || "",
      amount: Number(milestone.amount),
      dueDate: milestone.dueDate,
      status: milestone.status || "Pending",
      paymentStatus: milestone.paymentStatus || "Not Paid",
    }))
    .filter(
      (milestone) =>
        milestone.title &&
        !Number.isNaN(milestone.amount) &&
        milestone.amount >= 0 &&
        milestone.dueDate
    );
};

const createProject = async (req, res) => {
    try {
        const id = req.params.id;

        // Validate Client ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client!"
            });
        }
        const {
            title,
            description,
            startDate,
            deadline,
            budget,
            milestones,
        } = req.body;
 

        // Required fields
        if (!title || !description || !startDate || !deadline) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided!"
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(deadline);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }

        // Validate deadline
        if (end < start) {
            return res.status(400).json({
                success: false,
                message: "Deadline cannot be before start date"
            });
        }

        // Check client exists
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client not found"
            });
        }

        // Activate client if not already active
        if (client.status !== "Active") {
            client.status = "Active";
            await client.save();
        }

        const normalizedMilestones = normalizeMilestones(milestones);

        if (normalizedMilestones.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one project milestone is required",
            });
        }


        // Create project
        const project = await Project.create({
            client: id,
            title,
            description,
            startDate: start,
            deadline: end,
            budget,
            status: "Active",
            milestones: normalizedMilestones,
        });
        const populatedProject = await Project.findById(project._id)
        .populate("client","name email");

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project:populatedProject
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
};

const allAdminProjects = async(req,res)=>{
    try{
        const Projects = await Project.find({})
        .populate("client","name email");


        return res.status(200).json({
            success:true,
            Projects
        })
    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const singleProject = async(req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid project!"
            })
        }
        const project = await Project.findById(id)
        .populate("client","name email");
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found!"
            });
        }

        return res.status(200).json({
            success:true,
            project
        })


    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const updateProject = async(req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid project ID"
            });
        }
        const project = await Project.findById(id);
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found!"
            });
        }
        Object.assign(project,req.body)
        await project.save();

        return res.status(200).json({
            success:true,
            message:"Project update successful"
        });

    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const completeProject = async(req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid project ID"
            });
        }
        const project = await Project.findById(id)
        .populate("client","name email");
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }

        if(project.status==='Cancelled'){
            return res.status(400).json({
                success:false,
                message:"Project was marked as cancelled"
            });
        }else if(project.status==='Completed'){
            return res.status(400).json({
                success:false,
                message:"Project already marked as completed"
            });
        }
        project.status="Completed";
        await project.save();

        return res.status(200).json({
            success:true,
            message:"Project has been marked complete"
        });
    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const deleteProject = async(req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid project ID"
            });
        }
        const project = await Project.findById(id)
        .populate("client","name email");
        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }
        await project.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Project deleted successfully"
        });
    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const getClientProject = async(req,res)=>{
    try{
        const clientId = req.user.id;
        
        const clientProjects = await Project.find({
            client:clientId
        })
        .populate("client","name email");
        return res.status(200).json({
            success:true,
            clientProjects
        })

    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}

const oneClientProject = async(req,res)=>{
    try{
        const clientId = req.params.id;
        
        const project = await Project.find({
            client:clientId
        })
        .populate("client","name email");
        if(project.length===0){
            return res.status(404).json({
                success:false,
                message:"No Projects found"
            });
        }
        return res.status(200).json({
            success:true,
            project
        });

    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}
const cancelProject = async(req,res)=>{
    try{

        const id = req.params.id;

        const project = await Project.findById(id);

        if(!project){
            return res.status(404).json({
                success:false,
                message:"Project not found"
            });
        }

        if(project.status==="Cancelled"){
            return res.status(400).json({
                success:false,
                message:"Project already cancelled"
            });
        }

        project.status="Cancelled";

        await project.save();

        return res.status(200).json({
            success:true,
            message:"Project cancelled successfully"
        });

    }catch(err){
        console.error(err);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

const updateMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const milestone = project.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    const allowedFields = ["title", "description", "amount", "dueDate", "status"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        milestone[field] = req.body[field];
      }
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const submitMilestonePayment = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const clientId = req.user.id;
    const { paymentReference, paymentNote } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      client: clientId,
    }).populate("client", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const milestone = project.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    if (milestone.paymentStatus === "Received") {
      return res.status(400).json({
        success: false,
        message: "This milestone payment has already been confirmed",
      });
    }

    milestone.paymentStatus = "Submitted";
    milestone.paymentReference = paymentReference || "";
    milestone.paymentNote = paymentNote || "";
    milestone.paidAt = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Payment submitted. Admin will confirm receipt.",
      project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const confirmMilestonePayment = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId).populate("client", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const milestone = project.milestones.id(milestoneId);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found",
      });
    }

    milestone.paymentStatus = "Received";
    milestone.paymentConfirmedAt = new Date();

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Milestone payment marked as received",
      project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




module.exports = {
    createProject
    ,allAdminProjects
    ,singleProject,
    updateProject,
    updateMilestone,
    completeProject,
    submitMilestonePayment,
    deleteProject,
    confirmMilestonePayment,
    getClientProject,
    oneClientProject,
    cancelProject
}