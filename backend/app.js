import express from 'express';
import "dotenv/config";
import connectDb from './Db/db.js';
import morgan from 'morgan';
import userRoute from './Routes/user.routes.js';
import projectRoute from './Routes/project.routes.js'
import paymentRoute from './Routes/payment.routes.js'
import pledgeRoute from './Routes/pledge.routes.js'
import transactionRoute from './Routes/transaction.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  }
const server=express();


connectDb();
server.use(cors(corsOptions))
server.use(morgan('dev'))
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true, limit: "10mb" }));
server.use(cookieParser())

server.use('/user',userRoute);
server.use('/project',projectRoute);
server.use('/payment',paymentRoute);
server.use('/pledge',pledgeRoute);
server.use('/transaction',transactionRoute);

server.get('/',(req,res)=>{
    res.send("API Working");
});

server.listen(3000,()=>{
    console.log("Server Running on Port 3000")
});