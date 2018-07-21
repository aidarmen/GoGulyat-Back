const express = require('express')
const router = express.Router()
const { verifyJWT_MW } = require('../middlewares/auth.mw')

const { create_group,
        get_user_groups,
        get_course_groups,
        add_user_to_group,
        get_group_time,
        get_users_in_group
    } = require('../controllers/group.controller')

router.post('/create' ,verifyJWT_MW,create_group)
router.post('/add_student' ,verifyJWT_MW,add_user_to_group)
router.get('/get' ,verifyJWT_MW,get_user_groups)
router.get('/get_course/:course_id',get_course_groups)
router.get('/get_group_time/:group_id',verifyJWT_MW,get_group_time)
router.get('/get_users_in_group/:group_id',verifyJWT_MW,get_users_in_group)


// router.post('/get' ,verifyJWT_MW,get_user_groups)
// router.post('/getall' ,verifyJWT_MW,get_user_groups)

module.exports = router