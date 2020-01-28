
import mysql from "mysql";

console.log( process.env.RDS_MYSQL_HOSTNAME );
// RDS_MYSQL_HOSTNAME=vaayu-uat.cjny84emnsh9.ap-south-1.rds.amazonaws.com
// RDS_MYSQL_USERNAME=MOOVE_DEV
// RDS_MYSQL_PASSWORD=NG$Pir7ySMJ9m&p9
// RDS_MYSQL_DATABASE=moove_db_uat
const con = mysql.createConnection(
    {
        host: "vaayu-uat.cjny84emnsh9.ap-south-1.rds.amazonaws.com",
        user: "MOOVE_DEV",
        password: "NG$Pir7ySMJ9m&p9",
        port: 3306,
        database: "moove_db_uat"
    }
)


export default {

    read(query:string , data?:object): Promise<any> {
        return new Promise((resolve, reject) => {
            con.query(query, data, (er, res, fields) => {
                if (er) reject(er)
                else resolve(res)
            })
        })
    }

}