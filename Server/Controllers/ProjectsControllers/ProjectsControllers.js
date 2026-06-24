const mongoose = require("mongoose");
const Client = require("../../Models/Clients/Client.model");
const Project = require("../../Models/Projects/projectsModel");

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
            budget
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

        // Create project
        const project = await Project.create({
            client: id,
            title,
            description,
            startDate: start,
            deadline: end,
            budget,
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            project
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
        const Projects = await Project.find({});


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





module.exports = {createProject,allAdminProjects,singleProject}