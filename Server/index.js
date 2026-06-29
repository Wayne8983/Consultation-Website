require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require('./Config/db');
const autoCompleteMeetings = require("./Utils/nodeCronJob");
const ConsulRoutes = require('./Routes/ConsultationRoutes/ConsultationRoutes');
const authRoutes = require("./Routes/AuthRoutes/AuthRoutes");
const adminRoutes = require('./Routes/AdminRoutes/AdminRoutes');
const ClientRoutes = require("./Routes/ClientRoutes/ClientRoutes");

const blogRoutes = require("./Routes/BlogRoutes/BlogRoutes");
const ContactUs = require('./Routes/ContactRoutes/ContactRoutes');
const cors = require("cors");


connectDB();
autoCompleteMeetings();

//Middleweares 
app.use(express.json());
app.use(cors());

app.use('/api/consultations',ConsulRoutes);

//routes for Admin
app.use('/admin',adminRoutes);

//routes for clients
app.use('/client',ClientRoutes);

//Authentication routes for login 
app.use('/users',authRoutes);

//Routes for the contact message in the Contact us section
app.use('/api',ContactUs);

//The routes for the Blogs
app.use('/blog',blogRoutes);




const port = process.env.PORT || 3000;  

app.listen(port,()=>{
    console.log(`Server is running on port ${port} `);
})