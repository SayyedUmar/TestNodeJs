'use strict'

const model = require('../models/userModel');
const helper = require('../helpers/commonHelper')
const moment = require('moment')

exports.getUserTrips = async (req, res) => {
    let { emp_id, current_date,  start_date, end_date } = req.body;
    console.log(req.body);
    
    if (typeof emp_id !== 'number') {
        return res.json(helper.responseFormat(false, {}, {}, "invalid emp_id"))
    } else if (!(typeof current_date === 'string')) {
        let d1 = moment(start_date, 'DD-MM-YYYY');
        let d2 = moment(end_date, 'DD-MM-YYYY');
        if (!(typeof start_date === 'string') || !d1.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid start_date"))
        } else if (!(typeof end_date === 'string') || !d2.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid end_date"))
        }
        let user = await model.getUserTrips(emp_id, d1.format("DD-MM-YYYY"), d2.format("DD-MM-YYYY"));    
        return res.json(helper.responseFormat(true, user, {}, ""));    
    } else {
        let m = moment(current_date, 'DD-MM-YYYY');
        if (!m.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid current_date"))
        }
        let user = await model.getUserTrips(emp_id, m.weekday(1).format("DD-MM-YYYY"), m.weekday(7).format("DD-MM-YYYY"));
        return res.json(helper.responseFormat(true, user, {}, ""));    
    }
}

exports.getUserShifts = async (req,res) => {
    var {user_id} = req.body;
    if (typeof user_id !== 'number') {
        return res.json(helper.responseFormat(false, {}, {}, "user_id is required"))
    }
    let user = await model.getUserShifts(user_id)
    return res.json(helper.responseFormat(true, user, {}, ""));    
}



exports.upsertTrip = async (req, res) => {
    let {emp_id, trip_type, schedule_date, site_id, shift_id} = req.body;

    console.log(req.body)

    return res.json(helper.responseFormat(true, {}, {}, ""));    
}


// exports.getAllShifts = async (req,res) => {
//     let user = await model.getAllShifts(user_id)
//     return res.json(helper.responseFormat(true, user, {}, ""));    
// }

exports.getAllShifts = async (req, res) => {
    var {site_id, date} = req.body;
    if (!site_id || !date ) {
        return res.json(helper.responseFormat(false, {}, {}, "site_id, date is required"))
    }
    date = moment(date, 'DD-MM-YYYY')
    if (!date.isValid()) {
        return res.json(helper.responseFormat(false, {}, {}, "wrong date format"))
    }
    var day = date.day()
    var isWeekend = (day === 6) || (day === 0);
    let shifts = await model.getAllShifts(site_id, isWeekend)
    return res.json(helper.responseFormat(true, shifts, {}, ""));    
}

exports.searchEmployees = async (req, res) => {
    let {emp_name, site_id, shift_id, offset} = req.body
    if (typeof shift_id !== 'number' || !site_id) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid shift_id or site_id"))
    } else if (typeof emp_name !== 'string') {
        return res.json(helper.responseFormat(false, {}, {}, "employee_name is required"))
    }
    let shifts = await model.searchEmployees(site_id, emp_name, shift_id, offset)
    return res.json(helper.responseFormat(true, shifts, {}, ""));    
}


exports.setup_schedule = async (req, res) => {
    var {site_id, shift, trip_type, date, list} = req.body
    if (!site_id || !shift || !trip_type || !date || !list) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
    } 
    let shifts = await model.setup_schedule(site_id, shift, trip_type, moment(date), list)
    return res.json(helper.responseFormat(true, shifts, {}, ""));    
}

exports.getShiftUsers = async (req, res) => {
    var {site_id, shift, trip_type, date } = req.body;
    if (!site_id || !shift || !trip_type || !date) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
    } 
    let m = moment(date)
    var d = m.toISOString();
    d = d.substr(0, d.indexOf(':00.'))
    d = d + 'Z';
    let shifts = await model.getShiftUsers(site_id, shift, trip_type, d)
    return res.json(helper.responseFormat(true, shifts, {}, ""));    
}