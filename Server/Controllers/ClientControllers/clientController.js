const { default: mongoose } = require("mongoose");
const Client = require("../../Models/Clients/Client.model");
const Admin = require("../../Models/Admin/Admin.model");
const Project = require("../../Models/Projects/projectsModel");
const { HashPassword, ConfirmHash } = require("../../Utils/HashPassword");
const validator = require("validator");

const createClient = async (req, res) => {
    try {
        let { name, email, password, phone, company } = req.body;

        // Trim strings
        name = name?.trim();
        email = email?.trim().toLowerCase();
        phone = phone?.trim();
        company = company?.trim();

        // Required fields
        if (!name || !email || !password || !phone || !company) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Password validation
        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!strongPassword.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
            });
        }

        // Phone validation
        if (!/^\+?[1-9]\d{7,14}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phone number"
            });
        }

        // Check duplicates with one query
        const existingClient = await Client.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingClient) {
            if (existingClient.email === email) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            if (existingClient.phone === phone) {
                return res.status(409).json({
                    success: false,
                    message: "Phone number already exists"
                });
            }
        }

        // Hash password
        const hashedPassword = await HashPassword(password);

        // Create client
        const client = await Client.create({
            name,
            email,
            password: hashedPassword,
            phone,
            company
        });

        return res.status(201).json({
            success: true,
            message: "Client created successfully",
            clientId: client._id
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again later."
        });
    }
};

const suspendClient = async(req,res)=>{
    try{
        const id = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid client!"
            });
        }

        const client = await Client.findByIdAndUpdate(id,{status:'Suspended'});
        if(!client){
            return res.status(404).json({
                success:false,
                message:"Client not found"
            });
        }

        return res.status(200).json({
            success:true,
            message:"Client account suspended successfully"
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Internal Server error.Please try again later"
        });
    }
};


const changePassword = async(req,res)=>{
    try{
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid client!"
            });
        }
        const { oldPassword,newPassword } = req.body;
        if(!oldPassword || !newPassword ){
            return res.status(400).json({
                success:false,
                message:"Please fill in the fields"
            });
        }

        const user = await Client.findById(id) || await Admin.findById(id);
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Invalid user!"
            })
        }
        const isMatch = await ConfirmHash(oldPassword,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid old password!"
            });
        }

        const strongPassword =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

        if (!strongPassword.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
            });
        }
        const samePassword = await ConfirmHash(newPassword,user.password);
        if(samePassword){
            return res.status(400).json({
                success:false,
                message:"New password must be different from the old password!"
            })
        }

        //hash new password
        const hash = await HashPassword(newPassword);


        user.password=hash;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        });




    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}


const getClientProfile = async(req,res)=>{
    try{
        const id = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user!"
            });
        }
        const user = await Client.findById(id)
        .select("-password -mustChangePassword")
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Invalid user"
            });
        }

        return res.status(200).json({
            success:true,
            user
        });



    }catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again later."
        });
    }
}







module.exports = {
    createClient,
    suspendClient,
    changePassword,
    getClientProfile
};