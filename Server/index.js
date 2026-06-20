require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require('./Config/db');
const ConsulRoutes = require('./Routes/ConsultationRoutes/ConsultationRoutes');
const authRoutes = require("./Routes/AuthRoutes/AuthRoutes");
const adminRoutes = require('./Routes/AdminRoutes/AdminRoutes');
const ClientRoutes = require("./Routes/ClientRoutes/ClientRoutes");
const cors = require("cors");


connectDB();

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



const port = process.env.PORT || 3000;  

app.listen(port,()=>{
    console.log(`Server is running on port ${port} `);
})