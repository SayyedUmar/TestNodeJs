var baseModel = require(appRoot + '/models/baseModel');

exports.getUser = (uid) => {

	let strSqlQuery = `SELECT id from users WHERE uid="${uid}";`;

	return baseModel.read(strSqlQuery);
};

exports.getUserByEmployeeId = (employeeId) => {

	let strSqlQuery = `SELECT id from users WHERE entity_id="${employeeId}" and entity_type="Employee";`;

	return baseModel.read(strSqlQuery);
};


// myscustm apis
exports.getUserById = (id) => {
    let query = `SELECT * from users WHERE id="${id}";`;
    return baseModel.read(query)
};

exports.getUserCount = () => {
    let query = `SELECT count(*)from users ;`;
    return baseModel.read(query)
}

exports.getUserTrips = (emp_id, start, end) => {
    //SELECT * from employee_trips WHERE employee_id =9225 and (schedule_date BETWEEN STR_TO_DATE('20-01-2020', '%d-%m-%Y') AND STR_TO_DATE('24-01-2020', '%d-%m-%Y'))
    let query = `SELECT * from employee_trips WHERE employee_id="${emp_id}" and schedule_date between STR_TO_DATE('${start}', '%d-%m-%Y') and STR_TO_DATE('${end}', '%d-%m-%Y') ;`;
    console.log(query);
    return baseModel.read(query)
}


exports.upsertTrip = (emp_id, trip_type, schedule_date, site_id, shift_id) => {
    //created_at , updated_at, date, status=upcoming, 
    let query = ``;
    console.log(query);
    return baseModel.read(query)
}



exports.searchEmployees = (site_id, emp_name, shift_id,offset) => {
    let count = (offset ? offset : 5)
//     SELECT u.id, u.entity_id, CONCAT(COALESCE(u.f_name,''),' ',COALESCE(u.l_name,'')) AS name 
// from  shift_users s join users u on s.user_id = u.id
// WHERE u.entity_type='Employee' AND (u.f_name like 'aj%' || u.l_name like 'a%')
// and shift_id = 621 And active = true
//  order by name limit 10;
    let query = `SELECT u.id, u.entity_id, CONCAT(COALESCE(u.f_name,''),' ',COALESCE(u.l_name,'')) AS name `
    +` from  shift_users s join users u on s.user_id = u.id `
    +` WHERE entity_type='Employee' AND shift_id=${shift_id} ` //AND site_id=${site_id}
    + ` AND (f_name like '${emp_name}%' || l_name like '${emp_name}%') `
    +` order by name limit ${count};`;
    console.log(query);
    return baseModel.read(query)
}

exports.getUserShifts = (user_id) => {
    let query = `SELECT s.id, s.name, su.user_id, s.start_time, s.end_time `+
    ` FROM  shift_users su join shifts s on su.shift_id = s.id `+
    ` where user_id = ${user_id};`
    console.log(query);
    return baseModel.read(query)
}

// exports.getAllShifts = () => {
//     let query = `SELECT id, name, start_time, end_time FROM  shifts;`
//     console.log(query);
//     return baseModel.read(query)
// }


exports.getAllShifts = (siteId, isWeekend) => {
    let query = `SELECT id, name, start_time, end_time, working_day, site_id FROM shifts `+
    ` WHERE site_id='${siteId}' AND status='active' ;`; //AND working_day='${isWeekend?'Weekend':'Weekday'}'
    console.log(query);
    return baseModel.read(query)
}


exports.setup_schedule = async (site_id, shift, trip_type, date, list) => {
    //INSERT INTO employee_trips (`id`, `employee_id`, `date`, `trip_type`, `status`, `created_at`, `updated_at`, `dismissed`, `site_id`, `state`, `schedule_date`, `bus_rider`, `is_clustered`, `route_order`, `is_rating_screen_shown`, `is_still_on_board_screen_shown`, `is_leave`) VALUES ('1203918', '9539', '2020-01-31 12:00:00', '0', 'upcoming', '2020-01-24 16:00:11', '2020-01-24 16:00:11', '0', '137', '0', '2020-01-31 12:00:00', '0', '0', '1', '0', '0', '0');
    let newDate= date.utc().format();
    var query = '';
    for (let item of list) {
        let recod = await isTripExist(newDate, shift, item);
        console.log('\n---------- duplicate exist', JSON.stringify(recod));
        if (recod.length > 0) {
            if (recod[0].status === 'upcoming') {
                query = `UPDATE employee_trips SET shift_id='${shift.id}', updated_at='${newDate}' date='${newDate}' schedule_date='${newDate}' `
                + `WHERE id='${recod[0].id}' ;`;
            } else {
                
            }
            console.log('update query', query)
        } else {
            let type = trip_type === 'check_in' ? 0 : 1;
            query = `INSERT INTO employee_trips(site_id,shift_id,employee_id,date,schedule_date,created_at,updated_at,status,trip_type) `+
            ` VALUES ('${site_id}','${shift.id}','${item.entity_id}','${newDate}', '${newDate}', '${newDate}', '${newDate}','upcoming', '${type}') ;`;
        }
        console.log(query);
    }
    
    return "";
    // return baseModel.read(query)
}

exports.getShiftUsers = (site_id, shift, trip_type, date) => {
    let type = trip_type === 'check_in' ? 0 : 1;
    let query = `SELECT u.id,entity_id,trip_type, t.status, shift_id,CONCAT(ifnull(f_name,''),' ',ifnull(l_name,'')) AS name 
        FROM employee_trips t join users u on t.employee_id=u.entity_id
        WHERE shift_id=${shift.id} AND (schedule_date='${date}' || date='${date}') AND trip_type='${type}'
        order by name;`
    console.log(query);
    return baseModel.read(query)
    // return query;
}

const isTripExist = (date, shift, emp) => {
    let query = `SELECT id,trip_id,status FROM employee_trips WHERE date='${date}' AND employee_id=${emp.entity_id} AND shift_id=${shift.id} ;`
    // console.log('isTripExist ', query)
    return baseModel.read(query)
}



