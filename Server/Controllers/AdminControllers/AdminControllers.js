const Consultations =require('../../Models/Consultations/Consultation.model');
const Client = require('../../Models/Clients/Client.model');
const generateStrongPassword = require('../../Services/generateRandomPassword');
const { HashPassword } = require('../../Utils/HashPassword');
const  sendEmail  = require('../../Services/mailService');
const mongoose = require("mongoose");
const Project = require('../../Models/Projects/projectsModel');

const getAllConsultations = async(req,res)=>{
    try {
            const consultations = await Consultations.find({});
            return res.status(200).json({
                success:true,
                count:consultations.length,
                consultations
            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error.please try again later!"
        })
    }

};

const getOneConsultation = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success:false,
                message:"Consultation not found!"
            });
        }
        const consultation = await Consultations.findById(id);
        if(!consultation){
            return res.status(404).json({
                success:false,
                message:"Invalid consultation"
            })
        }
        return res.status(200).json({
            success:true,
            consultation
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error.please try again later"
        })
    }

}


const approveConsultation = async(req,res)=>{
    try {

            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(404).json({
                    success:false,
                    message:"Invalid client!"
                })
            }
            const consultation = await Consultations.findById(id);

            if(!consultation){
                return res.status(404).json({
                    success:false,
                    message:"Invalid consultation or consultation does not exist!"
                });
            }

            //check if consultation is already approved
            if(consultation.status==='Approved'){
                return res.status(400).json({
                    success:false,
                    message:"consultation is already approved"
                });
            }

            //check if client already exists
            const client = await Client.findOne({email:consultation.email});
            if(client){
                return res.status(409).json({
                    success:false,
                    message:"This consultation cannot be approved because a client account already exists"
                });
            }


            //create the client
            const password = generateStrongPassword();

            //we hash the password now
            const hash = await HashPassword(password);
            

            //we create the client now
            await Client.create({
                name:consultation.name,
                email:consultation.email,
                password:hash,
                phone:consultation.phone,
                company:consultation.company,
                consultationId:consultation._id
            })

            //send email for acc creation
            await sendEmail({
                to:consultation.email,
                subject:'Your Account Login Details',
                text:'Your Consultation request has been reviewed and approved login to continue',
                html: `
                        <h2>Account Created</h2>
                        <p><b>Email:</b> ${consultation.email}</p>
                        <p><b>Password:</b> ${password}</p>
                        <p>Please log in and change your password immediately.</p>
                    `,
            });

            //save approved
            consultation.status='Approved';
            await consultation.save();

        return res.status(200).json({
            success:true,
            message:"Consultation approved and client account created successfully."
        });
    }catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later."
        })
    }
}


///lets do get all clients for the admin
const allClients = async(req,res)=>{
    try{
        const clients = await Client.find({})
        .select('-password');

        return res.status(200).json({
            success:true,
            count:clients.length,
            clients
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error.Please try again later"
        })
    }

}

//lets build one client get api
const oneClient = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({
                success:false,
                message:"Invalid client!"
            })
        }

        const client = await Client.findById(id)
        .select('-password -mustChangePassword')
        if(!client){
            return res.status(404).json({
                success:false,
                message:"Invalid client"
            });
        }
        return res.status(200).json({
            success:true,
            client
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
        success: false,
        message: "Internal Server error please try again later"
        });
    }
  

}

const rejected = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success:false,
                message:"Invalid consultation!"
            })
        }
        const consultation = await Consultations.findById(id);
        if(!consultation){
            return res.status(404).json({
                success:false,
                message:"Consultation not found"
            });
        }
        
        if(consultation.status==='Approved'){
            return res.status(400).json({
                success:false,
                message:"Already approved consultations cannot be rejected"
            });
        }
        if(consultation.status==='Rejected'){
            return res.status(400).json({
                success:false,
                message:"Consultation already rejected"
            });
        }     
        
        consultation.status ='Rejected'
        await consultation.save();

        sendEmail({
            to: consultation.email,
            subject: "Consultation Request Rejected",
            text: "Your consultation request was rejected. Please contact the organisation for more information.",
            html: `
                <p><b>Email:</b> ${consultation.email}</p>
                <p>Please contact the organisation for more information.</p>
            `,
            })
            .then(() => {
                console.log(`Rejection email sent to ${consultation.email}`);
            })
            .catch((err) => {
                console.error("Failed to send rejection email:", err);
            });
        
        
        return res.status(200).json({
            success:true,
            message:"consultation request was successfully rejected"
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal server error please try again later"
        })
    }
}


const pendingConsultations = async(req,res)=>{
    try{
        const pending = await Consultations.find({status:"Pending"});

        return res.status(200).json({
            success:true,
            count:pending.length,
            pending
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server erro please tru again later"
        })
    }
}

const adminDashboard = async(req,res)=>{
    try{
        //Return all clients 
        const clients = await Client.countDocuments({});

        //Return all Consultations
        const consultations = await Consultations.countDocuments({});

        //Return Number of projects done
        const Projects = await  Project.countDocuments({});

        //pending Consultations
        const pendingConsultations = await Consultations.countDocuments({ status:"Pending" });
        const rejectedConsultations = await Consultations.countDocuments({ status:"Rejected" });
        const approvedConsultations = await Consultations.countDocuments({ status:"Approved" });


        return res.status(200).json({
            success:true,
            stats:{
                Projects,
                clients,
                consultations,
                pendingConsultations,
                approvedConsultations,
                rejectedConsultations
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error.please try again later"
        })
    }
}





module.exports = {
    getAllConsultations,
    approveConsultation,
    allClients,
    oneClient,
    rejected,
    pendingConsultations,
    adminDashboard,
    getOneConsultation
};