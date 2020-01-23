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

exports.getUserShifts = (id, start, end) => {
    //SELECT * from employee_trips WHERE employee_id =9225 and (schedule_date BETWEEN STR_TO_DATE('20-01-2020', '%d-%m-%Y') AND STR_TO_DATE('24-01-2020', '%d-%m-%Y'))
    let query = `SELECT * from employee_trips WHERE employee_id="${id}" and schedule_date between STR_TO_DATE('${start}', '%d-%m-%Y') and STR_TO_DATE('${end}', '%d-%m-%Y') ;`;
    console.log(query);
    return baseModel.read(query)
}