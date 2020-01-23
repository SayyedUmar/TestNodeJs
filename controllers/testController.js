'use strict'

const model = require('../models/userModel');
const helper = require('../helpers/commonHelper')
const moment = require('moment')

exports.getUserShifts = async (req, res) => {
    let { emp_id, current_date,  start_date, end_date } = req.body;
    console.log(emp_id, current_date, start_date, end_date);
    
    if (!(typeof emp_id === 'number')) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid user_id"))
    } else if (!(typeof current_date === 'string')) {
        let d1 = moment(start_date, 'DD-MM-YYYY');
        let d2 = moment(end_date, 'DD-MM-YYYY');
        if (!(typeof start_date === 'string') || !d1.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid start_date"))
        } else if (!(typeof end_date === 'string') || !d2.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid end_date"))
        }
        let user = await model.getUserShifts(emp_id, d1.format("DD-MM-YYYY"), d2.format("DD-MM-YYYY"));    
        return res.json(helper.responseFormat(true, user, {}, ""));    
    } else {
        let m = moment(current_date, 'DD-MM-YYYY');
        if (!m.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid current_date"))
        }
        let user = await model.getUserShifts(emp_id, m.weekday(1), m.weekday(7));
        return res.json(helper.responseFormat(true, user, {}, ""));    
    }
}
