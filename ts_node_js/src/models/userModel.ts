import baseModel from './baseModel';
import moment = require('moment');


class UserModel {

    searchEmployees(site_id: number, emp_name: string, shift_id: number, offset: number): Promise<any> {
        let count = (offset ? offset : 5)
        let query = `SELECT u.id, u.entity_id,  concat(ifnull(f_name,''),' ', ifnull(l_name, '')) as name 
        from  shift_users s INNER join users u on s.user_id = u.id 
        WHERE entity_type='Employee' AND shift_id=${shift_id} 
        AND (f_name like '${emp_name}%' || l_name like '${emp_name}%') 
        order by name limit ${count};`;  //AND site_id=${site_id}
        // console.log(query);
        return baseModel.read(query)
    }

    getUserShifts(user_id: number): Promise<any> {
        let query = `SELECT s.id, s.name, su.user_id, s.start_time, s.end_time ` +
            ` FROM  shift_users su INNER join shifts s on su.shift_id = s.id ` +
            ` where user_id = ${user_id};`
        // console.log(query);
        return baseModel.read(query)
    }


    getAllShifts(siteId: number) : Promise<any>{
        let query = `SELECT id, name, start_time, end_time, working_day, site_id FROM shifts ` +
            ` WHERE site_id='${siteId}' AND status='active' ;`; //AND working_day='${isWeekend?'Weekend':'Weekday'}'
        // console.log(query);
        return baseModel.read(query)
    }


    async setup_schedule(site_id: number, shift: any, trip_type: string, date: moment.Moment, list: [any]): Promise<any> {
        let newDate = date.utc().format();
        var query = '';
        for (let item of list) {
            let type:number = trip_type === 'check_in' ? 0 : 1;
            let recod = await this.isTripExist(newDate, item, type, site_id, shift);
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
                query = `INSERT INTO employee_trips(site_id,shift_id,employee_id,date,schedule_date,created_at,updated_at,status,trip_type) ` +
                    ` VALUES ('${site_id}','${shift.id}','${item.entity_id}','${newDate}', '${newDate}', '${newDate}', '${newDate}','upcoming', '${type}') ;`;
            }
            if (query.length > 10) {
                let res = await baseModel.read(query);
                res_arr.push(res);
            }
        }

        return res_arr;
    }

    getShiftUsers(site_id: number, shift: any, trip_type: string, date: string) : Promise<any>{
        let type = trip_type === 'check_in' ? 0 : 1;
        let query = `SELECT u.id,t.id as emp_trip_id,entity_id,trip_type, t.status, shift_id,CONCAT(ifnull(f_name,''),' ',ifnull(l_name,'')) AS name 
        FROM employee_trips t INNER join users u on t.employee_id=u.entity_id
        WHERE shift_id=${shift.id} AND site_id=${site_id} AND
        (schedule_date='${date}' || date='${date}') AND trip_type='${type}'
        order by name;`
        // console.log(query);
        return baseModel.read(query)
    }

    isTripExist(date: string, emp: any, trip_type: number, site_id: number, shift?: object) : Promise<any>{
        let query = `SELECT id,trip_id,status FROM employee_trips 
        WHERE employee_id=${emp.entity_id} AND status='upcoming' 
        AND site_id=${site_id} 
        AND trip_type=${trip_type} AND date LIKE '${date.substr(0, 10)}%' ;`
        // console.log('\nisTripExist ', query+'\n')
        return baseModel.read(query)
    }

    deleteUserShift(site_id: number, shift: any, trip_type: string, date: any, employee_id: number, emp_trip_id: number): Promise<any> {
        let type = trip_type === 'check_in' ? 0 : 1;
        let query = `DELETE FROM employee_trips
        WHERE status='upcoming' AND trip_type=${type} AND id=${emp_trip_id}
        AND employee_id=${employee_id} AND shift_id=${shift.id} ;`
        // console.log('deleteUserShift ', query)
        return baseModel.read(query)
    }

}

export default UserModel