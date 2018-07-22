const express = require('express')
const router = express.Router()
const { verifyJWT_MW } = require('../middlewares/auth.mw')

const {create_event, get_my_event, get_all_events} = require('../controllers/event.controller')

router.post('/create' ,create_event)
router.get('/get/:email' , get_my_event)
router.get('/getall/:email' , get_all_events)





module.exports = router