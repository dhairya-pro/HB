import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser'; 
import connect from './db/db.connect.js';
import patientroutes from './routes/patient.routes.js';
import { urlencoded } from 'express';
import doctorroutes from './routes/doctor.routes.js';
import cors from 'cors';
const app= express()
connect()
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  
    credentials: true,  
  }));
 
app.use(morgan('dev'))
app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use('/patient',patientroutes)
app.use('/doctor',doctorroutes)
app.get('/',(req,res)=>{
    res.send("hello world")
})

export default app