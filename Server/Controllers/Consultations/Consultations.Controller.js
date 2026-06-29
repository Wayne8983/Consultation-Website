const Consultation = require('../../Models/Consultations/Consultation.model');

const bookConsultation = async(req,res)=>{
    try{
        const {name,email,phone,company,projectType,description,preferredContactMethod} = req.body;
        if(!name||!email||!phone||!projectType||!description||!preferredContactMethod){
            return res.status(400).json({
                success:false,
                message:"Please fill in all the required fields"
            });
        }

        const user = await Consultation.findOne({ email });
        if(user){
            return res.status(409).json({
                success:false,
                message:"User with email exists"
            })
        }

        const consultation = await Consultation.create({
            name,
            email,
            phone,
            company,
            projectType,
            description,
            preferredContactMethod
        });


        return res.status(201).json({
            success:true,
            message:"Consultation request Sent!"
        });




    }catch(err){
        // Check if the error comes from Mongoose model validation
        if (err.name === 'ValidationError') {
        const formattedErrors = {};
        
        // Loop through fields to extract our custom messages
        Object.keys(err.errors).forEach((key) => {
            formattedErrors[key] = err.errors[key].message;
        });

        // Send 400 Bad Request with the error dictionary
        return res.status(400).json({ errors: formattedErrors });
        }

        console.log('Consultation Booking error',err);

        return res.status(500).json({
            success:false,
            message:"Internal server error.Please try again later"
        });
    }
}


module.exports = bookConsultation;