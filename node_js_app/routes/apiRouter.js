'use strict'

const router = express.Router()
const middleware = require('../middleware');
const user = require('../controllers/userController');
const test = require('../controllers/testController');

const multer   = require('multer');
const multerUpload   = multer();
const multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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

router.post('/getDirections', test.getDirections);

// router.post('/vehicles', multerUpload.single('image'), test.vehicles);
router.post('/vehicles', multipartMiddleware, test.vehicles);


module.exports = router
