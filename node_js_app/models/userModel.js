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
    // console.log(query);
    return baseModel.read(query)
}



exports.searchEmployees = (site_id, emp_name, shift_id,offset) => {
    let count = (offset ? offset : 5)
    let query = `SELECT u.id, u.entity_id,  concat(ifnull(f_name,''),' ', ifnull(l_name, '')) as name 
        from  shift_users s INNER join users u on s.user_id = u.id 
        WHERE entity_type='Employee' AND shift_id=${shift_id} 
        AND (f_name like '${emp_name}%' || l_name like '${emp_name}%') 
        order by name limit ${count};`;  //AND site_id=${site_id}
    // console.log(query);
    return baseModel.read(query)
}

exports.getUserShifts = (user_id) => {
    let query = `SELECT s.id, s.name, su.user_id, s.start_time, s.end_time `+
    ` FROM  shift_users su INNER join shifts s on su.shift_id = s.id `+
    ` where user_id = ${user_id};`
    // console.log(query);
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
    // console.log(query);
    return baseModel.read(query)
}


exports.setup_schedule = async (site_id, shift, trip_type, date, list) => {
    //INSERT INTO employee_trips (`id`, `employee_id`, `date`, `trip_type`, `status`, `created_at`, `updated_at`, `dismissed`, `site_id`, `state`, `schedule_date`, `bus_rider`, `is_clustered`, `route_order`, `is_rating_screen_shown`, `is_still_on_board_screen_shown`, `is_leave`) VALUES ('1203918', '9539', '2020-01-31 12:00:00', '0', 'upcoming', '2020-01-24 16:00:11', '2020-01-24 16:00:11', '0', '137', '0', '2020-01-31 12:00:00', '0', '0', '1', '0', '0', '0');
    let newDate= date.utc().format();
    var query = '';
    for (let item of list) {
        let type = trip_type === 'check_in' ? 0 : 1;
        let recod = await isTripExist(newDate, shift, item, type, site_id);
        // console.log('\n---------- duplicate exist', JSON.stringify(recod));
        var res_arr = []
        if (recod.length > 0) {
            if (recod[0].status === 'upcoming') {
                query = `UPDATE employee_trips SET shift_id='${shift.id}', trip_type=${type}, 
                updated_at='${newDate}', date='${newDate}', schedule_date='${newDate}' 
                WHERE id='${recod[0].id}' ;`;
            } else {
                
            }
            // console.log('update query', query)
        } else {
            query = `INSERT INTO employee_trips(site_id,shift_id,employee_id,date,schedule_date,created_at,updated_at,status,trip_type) `+
            ` VALUES ('${site_id}','${shift.id}','${item.entity_id}','${newDate}', '${newDate}', '${newDate}', '${newDate}','upcoming', '${type}') ;`;
        }
        if (query.length > 10) {
            let res = await baseModel.read(query);
            res_arr.push(res);
        }
    }
    
    return res_arr;
}

exports.getShiftUsers = (site_id, shift, trip_type, date) => {
    let type = trip_type === 'check_in' ? 0 : 1;
    let query = `SELECT u.id,t.id as emp_trip_id,entity_id,trip_type, t.status, shift_id,CONCAT(ifnull(f_name,''),' ',ifnull(l_name,'')) AS name 
        FROM employee_trips t INNER join users u on t.employee_id=u.entity_id
        WHERE shift_id=${shift.id} AND t.site_id=${site_id} AND
        (schedule_date='${date}' || date='${date}') AND trip_type='${type}'
        order by name;`
    // console.log(query);
    return baseModel.read(query)
}

const isTripExist = (date, shift, emp, trip_type, site_id) => {
    let query = `SELECT id,trip_id,status FROM employee_trips 
        WHERE employee_id=${emp.entity_id} AND status='upcoming' 
        AND site_id=${site_id} 
        AND trip_type=${trip_type} AND date LIKE '${date.substr(0,10)}%' ;`
    // console.log('\nisTripExist ', query+'\n')
    return baseModel.read(query)
}

exports.deleteUserShift = (site_id, shift, trip_type, date, employee_id, emp_trip_id) => {
    let type = trip_type === 'check_in' ? 0 : 1;
    let query = `DELETE FROM employee_trips
        WHERE status='upcoming' AND trip_type=${type} AND id=${emp_trip_id}
        AND employee_id=${employee_id} AND shift_id=${shift.id} ;`
    // console.log('deleteUserShift ', query)
    return baseModel.delete(query)
}

exports.googleDirectionApi = () => {
    
}


