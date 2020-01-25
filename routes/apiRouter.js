'use strict'

const router = express.Router()
const middleware = require('../middleware');
const user = require('../controllers/userController');
const test = require('../controllers/testController');

router.use(middleware.validateHeaders)

router.get('/', (req, res) => {
	res.json({'in api router': 'true'});
});

// router.get('/get_users_count', (req, res) => {
// 	res.json({'iget_users_count': 'true'});
// });

router.get('/user/:id', user.getUserByID);
router.get('/user_count', user.getUserCount);

router.post('/getUserTrips', test.getUserShifts);

router.post('/searchEmployee', test.searchEmployees);
router.post('/getUserShifts', test.getUserShifts);
router.post('/getAllShifts', test.getAllShifts);
router.post('/setup_schedule', test.setup_schedule);
router.post('/getShiftUsers', test.getShiftUsers);
router.post('/deleteUserShift', test.deleteUserShift);


module.exports = router