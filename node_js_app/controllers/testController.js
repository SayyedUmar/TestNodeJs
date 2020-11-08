'use strict'

const model = require('../models/userModel');
const helper = require('../helpers/commonHelper')
const moment = require('moment')
const _ = require('lodash')
const request = require('request')


exports.getUserTrips = async (req, res) => {
    let { emp_id, current_date, start_date, end_date } = req.body;
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
        try {
            let user = await model.getUserTrips(emp_id, d1.format("DD-MM-YYYY"), d2.format("DD-MM-YYYY"));
            return res.json(helper.responseFormat(true, user, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    } else {
        let m = moment(current_date, 'DD-MM-YYYY');
        if (!m.isValid()) {
            return res.json(helper.responseFormat(false, {}, {}, "invalid current_date"))
        }
        try {
            let user = await model.getUserTrips(emp_id, m.weekday(1).format("DD-MM-YYYY"), m.weekday(7).format("DD-MM-YYYY"));
            return res.json(helper.responseFormat(true, user, {}, ""));
        } catch (e) {
            return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
        }
    }
}

exports.getUserShifts = async (req, res) => {
    var { user_id } = req.body;
    if (typeof user_id !== 'number') {
        return res.json(helper.responseFormat(false, {}, {}, "user_id is required"))
    }
    try {
        let user = await model.getUserShifts(user_id)
        return res.json(helper.responseFormat(true, user, {}, ""));
    } catch (e) {
        return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
    }
}


// exports.getAllShifts = async (req,res) => {
//     let user = await model.getAllShifts(user_id)
//     return res.json(helper.responseFormat(true, user, {}, ""));    
// }

exports.getAllShifts = async (req, res) => {
    var { site_id, date } = req.body;
    if (!site_id || !date) {
        return res.json(helper.responseFormat(false, {}, {}, "site_id, date is required"))
    }
    date = moment(date, 'DD-MM-YYYY')
    if (!date.isValid()) {
        return res.json(helper.responseFormat(false, {}, {}, "wrong date format"))
    }
    var day = date.day()
    var isWeekend = (day === 6) || (day === 0);

    try {
        let shifts = await model.getAllShifts(site_id, isWeekend)
        return res.json(helper.responseFormat(true, shifts, {}, ""));
    } catch (e) {
        return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
    }
}

exports.searchEmployees = async (req, res) => {
    let { emp_name, site_id, shift_id, offset } = req.body
    if (typeof shift_id !== 'number' || !site_id) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid shift_id or site_id"))
    } else if (typeof emp_name !== 'string') {
        return res.json(helper.responseFormat(false, {}, {}, "employee_name is required"))
    }
    try {
        let shifts = await model.searchEmployees(site_id, emp_name, shift_id, offset)
        return res.json(helper.responseFormat(true, shifts, {}, ""));
    } catch (e) {
        return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
    }

}


exports.setup_schedule = async (req, res) => {
    var { site_id, shift, trip_type, date, list } = req.body
    if (!site_id || !shift || !trip_type || !date || !list) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
    }

    try {
        let shifts = await model.setup_schedule(site_id, shift, trip_type, moment(date), list)
        return res.json(helper.responseFormat(true, shifts, {}, ""));
    } catch (e) {
        return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
    }
}

exports.getShiftUsers = async (req, res) => {
    var { site_id, shift, trip_type, date } = req.body;
    if (!site_id || !shift || !trip_type || !date) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
    }
    let m = moment(date)
    var d = m.toISOString();
    d = d.substr(0, d.indexOf(':00.'))
    d = d + 'Z';
    try {
        let shifts = await model.getShiftUsers(site_id, shift, trip_type, d)
        return res.json(helper.responseFormat(true, shifts, {}, ""));
    } catch (e) {
        return res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong"));
    }
}


exports.deleteUserShift = (req, res) => {
    var { site_id, shift, trip_type, date, employee_id, emp_trip_id } = req.body;
    if (!emp_trip_id || !site_id || !shift || !trip_type || !date || !employee_id) {
        return res.json(helper.responseFormat(false, {}, {}, "invalid data"))
    }
    let m = moment(date)
    var d = m.toISOString();
    d = d.substr(0, d.indexOf(':00.'))
    d = d + 'Z';

    model.deleteUserShift(site_id, shift, trip_type, d, employee_id, emp_trip_id)
        .then(val => res.json(helper.responseFormat(true, val, {}, "")))
        .catch(e => res.json(helper.responseFormat(false, {}, { error: e }, "Something went wrong")))

}

const baseGoogleMapUrl2 = 'https://maps.googleapis.com/maps/api/directions/json?'
const mapKey = 'AIzaSyCKmOycgAQLZGOsJBSFkhOp2LWakMC6vn0';
// const mapKey = 'AIzaSyDdFf6z-3kmeqB1wRdvoHqeetb79TZulx0';

exports.getDirections = (req, res) => {
    // return res.json(helper.responseFormat(false, {}, {}, "locations array is required"))
    const { locations } = req.body;
    if (!locations || !Array.isArray(locations) || locations.length < 2) 
        return res.json(helper.responseFormat(false, {}, {}, "locations array is required"))
    const latLongArray = _.map(locations, function (n) {
        return n.lat + '%2C' + n.lng
    })

    // waypoints
    let waypoints = _.cloneDeep(latLongArray)
    waypoints.splice(0, 1)
    waypoints.splice(waypoints.length - 1, 1)
    waypoints = waypoints.join("%7C")

    var googleDirectionApi = baseGoogleMapUrl2 + `origin=${latLongArray[0]}&destination=${latLongArray[latLongArray.length - 1]}&waypoints=${waypoints}&key=${mapKey}&mode=driving`;
    const arrivalTimeInSeconds = new Date();
    googleDirectionApi = googleDirectionApi + `&arrival_time=${arrivalTimeInSeconds}`;

    const params = {
        url: googleDirectionApi,
        method: 'GET'
    }

    request(params, async (error, response, body) => {
        if (error) {
            res.json(helper.responseFormat(false, {}, {}, "Something went wrong"));
        } else {
            body = JSON.parse(body)
            if (body.status === 'OK') {
                return res.json(helper.responseFormat(true,  body, {}, ""));
            } else {
                res.json(helper.responseFormat(false, {}, {body, mapKey}, body.error_message));
            }
        }
    });
}

exports.vehicles = (req, res) => {
    console.log(req.body)
    console.log(req.files)
    res.json(helper.responseFormat(false, {}, {}, "Something went wrong"));
}

exports.sendTestNotif = async (req, res) => {
    tripModel.sendTestNotif(req.body);
    res.send(commonHelper.responseFormat(
      true,
      {},
      {},
      "Completed the trip"
    ))
  }




exports.sendTestNotif = () => {
    let message = {
      // notification : {
      //   title: 'title',
      //   body: 'body'
      // }
      // data: {
      //   push_type:"employee_trip_completed",
      //   "priority":"high",
      //   "content_available":"true",
      //   employee_trip_id: 14454+'',
      //   driver: JSON.stringify({
      //     "user_id":"15233",
      //     "username":"8369733451",
      //     "email":"8369733451@gmail.com",
      //     "f_name":"EbDriver",
      //     "m_name":"null",
      //     "l_name":"one",
      //     "phone":"8369733451",
      //     "profile_picture":"null",
      //     "operating_organization":{"name":"null","phone":"null"}
      //   }),
      //   vehicle:JSON.stringify({
      //     "id":"124","plate_number":"TEST007007","make":"2020-08-07T06:30:00.000Z",
      //     "model":"ERTIGA","colour":"BLUE","seats":"4","make_year":"2015",
      //     "photo":"https://vaayu-dev.s3.ap-south-1.amazonaws.com/vehicle_picture_url_1596811953.png"
      //   }),
      // }
      // data : {
      //   push_type: "driver_new_trip_assignment",
      //   current_trip:'true',
      //   trip_id:'2357',
      //   trip_type: 'check_in',
      //   passengers: '2',
      //   approximate_distance: '705',
      //   approximate_duration: '770',
      //   assign_request_expired_date: '1597589434',
      //   date: '1597589254',
      //   status: 'created',
      //   title:'title',
      //   body:'body',
      //   complex_object: JSON.stringify(
      //     {
      //       key: 'value',
      //       key1: {
      //         key: 'value',
      //       },
      //     }
      //   )
      // }
    }
    try {
      admin.messaging().sendToTopic(`techmblrprod_user_15232`,message)
    } catch (e){
      console.log(e)
    }
    
  }