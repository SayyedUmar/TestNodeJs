import express, { Application, Request, Response, NextFunction } from 'express';
import cors from "cors";
import bodyParser from 'body-parser';

import controller from './controllers/testController'



export const router = express.Router();

//options for cors midddleware
const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
  };

router.use(cors())

router.use(bodyParser.json())

router.get('/users', controller.getUsers)


router.post('/searchEmployee', controller.searchEmployees);
router.post('/getUserShifts', controller.getUserShifts);
router.post('/getAllShifts', controller.getAllShifts);
router.post('/setup_schedule', controller.setup_schedule);
router.post('/getShiftUsers', controller.getShiftUsers);
router.post('/deleteUserShift', controller.deleteUserShift);