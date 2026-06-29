const Meeting = require("../../Models/Meetings/Meeting.model");
const Client = require("../../Models/Clients/Client.model");
const mongoose = require("mongoose");
const {sendMeetingCreatedEmail} = require("../../Services/mailService");

const createMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, meetingDate, venue } = req.body;

        // Validate Client ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client ID"
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

        // Validate required fields
        if (!title?.trim() || !meetingDate?.trim() || !venue?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title, meeting date, and venue are required"
            });
        }

        // Convert string to Date object
        const meetingDateObj = new Date(meetingDate);

        // Validate date format
        if (isNaN(meetingDateObj.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid meeting date format"
            });
        }

        // Ensure meeting is not in the pasts
        if (meetingDateObj <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Meeting date and time must be in the future"
            });
        }

        const exists = await Meeting.findOne({
            client:id,
            meetingDate:meetingDateObj
        });
        if(exists){
            return res.status(409).json({
                success:false,
                message:"Meeting has already been created"
            })
        }

        // Create meeting
        const createdMeeting = await Meeting.create({
            client: id,
            title,
            description,
            meetingDate: meetingDateObj,
            venue,
            createdBy:req.user.id
        });

        const meeting = await Meeting.findById(createdMeeting.id)
        .populate("client","name email")
        .populate("createdBy","name email")



        await sendMeetingCreatedEmail({
            to: client.email,
            name: client.name,
            title,
            description,
            meetingDate: meetingDateObj,
            venue,
        });

        return res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            meeting
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
};

const getClientMeetings = async(req,res)=>{
    try{
        const id = req.user.id;

        const meetings = await Meeting.find({
            client:id
        })
        .populate("createdBy","name email")
        .sort({meetingDate:1});

        if(meetings.length===0){
            return res.status(200).json({
                success:true,
                meetings:[]
            })
        }

        return res.status(200).json({
            success:true,
            meetings
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        })
    }
};

const getAdminMeetings = async(req,res)=>{
    try{
        const meetings = await Meeting.find({})
        .populate("client","name email")
        .sort({meetingDate:1});

        const cancelled = meetings.filter(
            meeting => meeting.status==='Cancelled'
        );
        const scheduled = meetings.filter(
            meeting => meeting.status==='Scheduled'
        )
        
        const completed = meetings.filter(
            meeting => meeting.status==='Completed'
        )

        if(meetings.length === 0 ){
            return res.status(200).json({
                success:true,
                meetings:[]
            })
        }

        return res.status(200).json({
            success:true,
            meetings,
            cancelled,
            scheduled,
            completed
        })




    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        })
    }
}

const cancelMeeting = async(req,res) =>{
    try{
        const Id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(Id)){
            return res.status(400).json({
                success:false,
                message:"Invalid client id"
            });
        }
        

        const meeting = await Meeting.findById(Id);
        if(!meeting){
            return res.status(404).json({
                success:false,
                message:"Meeting not found"
            })
        }else if(meeting.status ==='Cancelled'){
            return res.status(400).json({
                success:false,
                message:"Meeting has already been cancelled"
            });
        }
        meeting.status='Cancelled'
        await meeting.save();

        return res.status(200).json({
            success:true,
            message:"Meeting has been cancelled successfully"
        });



    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        })
    }
}

const completeMeeting = async(req,res)=>{
    try{
        const id = req.params.id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid client Id"
            });
        }
        const meeting = await Meeting.findById(id);
        if(!meeting){
            return res.status(404).json({
                success:false,
                message:"Meeting not found"
            });
        }else if(meeting.status==='Completed' || meeting.status==='Cancelled'){
            return res.status(400).json({
                success:false,
                message:`Meeting has already been marked ${meeting.status}`
            })
        }

        meeting.status='Completed'
        await meeting.save();

        return res.status(200).json({
            success:true,
            message:"Meeting has been marked as complete"
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        })
    }
}

const getMeeting = async(req,res)=>{
    try{
        const id = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid meeting id"
            });
        }

        const meeting = await Meeting.findById(id)
        .populate("client","name email")
        .populate("createdBy","name email");

        if(!meeting){
            return res.status(404).json({
                success:false,
                message:"Meeting not found"
            });
        }

        return res.status(200).json({
            success:true,
            meeting
        });

    }catch(err){
        console.log(err);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}

const updateMeeting = async(req,res)=>{
    try{
        const id = req.params.id;

        const meeting = await Meeting.findById(id);

        if(!meeting){
            return res.status(404).json({
                success:false,
                message:"Meeting not found"
            });
        }

        Object.assign(meeting,req.body);

        await meeting.save();

        return res.status(200).json({
            success:true,
            message:"Meeting updated successfully",
            meeting
        });

    }catch(err){
        console.log(err);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}
const deleteMeeting = async(req,res)=>{
    try{
        const id = req.params.id;

        const meeting = await Meeting.findById(id);

        if(!meeting){
            return res.status(404).json({
                success:false,
                message:"Meeting not found"
            });
        }

        await meeting.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Meeting deleted successfully"
        });

    }catch(err){
        console.log(err);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
}



module.exports = { 
    createMeeting,
    getClientMeetings,
    getAdminMeetings,
    cancelMeeting,
    completeMeeting,
    getMeeting,
    updateMeeting,
    deleteMeeting
};