const Admin = require("../../Models/Admin/Admin.model");
const Client = require("../../Models/Clients/Client.model");
const { ConfirmHash } = require("../../Utils/HashPassword");
const { generateAccessToken } = require("../../Utils/generateToken");

const logIn = async(req,res)=>{
try {
        const { email , password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        
        //Lets check in the admins model first
        const admin = await Admin.findOne({email});
        if(admin){

            //Check if password is correct
            const isMatch = await ConfirmHash(password,admin.password);
            if(!isMatch){
                return res.status(401).json({
                    success:false,
                    message:"Invalid credentials!"
                })
            }

            //Lets generate an admin token
            const token = await generateAccessToken(admin,"admin");

            //Update last login
            await Admin.findByIdAndUpdate(
                admin._id,
                { lastLogin:new Date() }
            );


            //Lets return a response
            return res.status(200).json({
                token,
                userType:"admin",
                user:{
                    id:admin._id,
                    name:admin.name,
                    email:admin.email
                },
                success:true,
                message:"Login Successful"
            })            
        }

        //if not we check the clients model
        const client = await Client.findOne({email});
        if(client){

            //Lets confirm the password
            const Match = await ConfirmHash(password,client.password);
            if(!Match){
                return res.status(401).json({
                    success:false,
                    message:"Invalid Credentials"
                })
            }

            //Lets generate a client token
            const token = await generateAccessToken(client,"client");

            //Update last login
            await Client.findByIdAndUpdate(
                client._id,
                { lastLogin:new Date() }
            );

            //Lets return a response
            return res.status(200).json({
                token,
                user:{
                    id:client._id,
                    name:client.name,
                    email:client.email
                },
                userType:"client",
                success:true,
                message:"Login Successful"
            });
        }

        return res.status(401).json({
            success:false,
            message:"Invalid credentials!"
        })

} catch (error) {
    console.log(error);

    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });
}
}


module.exports={logIn}