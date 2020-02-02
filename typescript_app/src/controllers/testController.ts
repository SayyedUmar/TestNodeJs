import { Application, Request, Response, NextFunction } from 'express';
import moment from 'moment';
import helper from '../helpers/helper';
import UserModel from "../models/userModel";

// const test = {

//     getUsers: (req:Request, res:Response) => {
//         res.json({key:'users'})
//     }


// }

class TestController {

    model = new UserModel()

    getUsers(req: Request, res: Response) {
        res.json({ key: 'users' })
    }


    async getUserShifts(req: Request, res: Response) {
        var { user_id } = req.body;
        if (typeof user_id !== 'number') {
            return res.json(helper.responseFormat(false, {}, {}, "user_id is required"))
        }
        try {
            let user = await this.model.getUserShifts(user_id)
            return res.json(helper.responseFormat(true, user, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    }

    async getAllShifts(req: Request, res: Response) {
        var { site_id } = req.body;
        if (!site_id ) {
            return res.json(helper.responseFormat(false, {}, {}, "site_id, date is required"))
        }
        try {
            let shifts = await this.model.getAllShifts(site_id)
            return res.json(helper.responseFormat(true, shifts, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    }


    async searchEmployees(req: Request, res: Response) {
        let { emp_name, site_id, shift_id, offset } = req.body
        if (typeof shift_id !== 'number' || !site_id) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid shift_id or site_id"))
        } else if (typeof emp_name !== 'string') {
            return res.json(helper.responseFormat(false, {}, {}, "employee_name is required"))
        }
        try {
            let shifts = await this.model.searchEmployees(site_id, emp_name, shift_id, offset)
            return res.json(helper.responseFormat(true, shifts, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }

    }


    async setup_schedule(req: Request, res: Response) {
        var { site_id, shift, trip_type, date, list } = req.body
        if (!site_id || !shift || !trip_type || !date || !list) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
        }

        try {
            let shifts = await this.model.setup_schedule(site_id, shift, trip_type, moment(date), list)
            return res.json(helper.responseFormat(true, shifts, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    }

    async getShiftUsers(req: Request, res: Response) {
        var { site_id, shift, trip_type, date } = req.body;
        if (!site_id || !shift || !trip_type || !date) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
        }
        let m = moment(date)
        var d = m.toISOString();
        d = d.substr(0, d.indexOf(':00.'))
        d = d + 'Z';
        try {
            let shifts = await this.model.getShiftUsers(site_id, shift, trip_type, d)
            return res.json(helper.responseFormat(true, shifts, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    }

    deleteUserShift(req: Request, res: Response) {
        var { site_id, shift, trip_type, date, employee_id, emp_trip_id } = req.body;
        if (!emp_trip_id || !site_id || !shift || !trip_type || !date || !employee_id) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
        }
        let m = moment(date)
        var d = m.toISOString();
        d = d.substr(0, d.indexOf(':00.'))
        d = d + 'Z';

        this.model.deleteUserShift(site_id, shift, trip_type, d, employee_id, emp_trip_id)
            .then(val => res.json(helper.responseFormat(true, val, {}, "")))
            .catch(e => res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong")))

    }
}

export default new TestController()



