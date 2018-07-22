const mongoose = require('mongoose')

const USERS = require('../models/user')

// const USER_GROUP = require('../models/user_group')

// const USER_GROUP_TIME = require('../models/user_group_time')


const Event = require('../models/event')
const Config = require('../config/config')

function create_event(req, res) {

    USERS.findOne({ email: req.body.email }, (err, users) => {
        console.log(req.body.email)
        console.log("reed")
        if (err) {
            res.status(400).send({ err: err, data: null }).end();
            console.log("reed1")
        } else if (users) {
              
            var newEvent = new Event({
                email: req.body.email,
                text: req.body.text,
                where: req.body.where

            });
            
            newEvent.save(function(err, user) {
                if (err) res.status(400).send({ err: err, data: null }).end()
                else {
                   console.log("event created")
                   res.status(200).send(user).end()
                }
            })

        }else {
          console.log("wrong")
                   res.status(200).send("wrong staff").end()
        }
    })

}







function get_my_event(req, res) {
    Event.aggregate([
        { $match: { 'email': req.params.email } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
            console.log('i gave you user.s event ')
        }
    })
}

function get_all_events(req, res) {
    Event.find(
      [ {'email': {$nin : req.params.email}}]
    ).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
            console.log("all events except yours")
        }
    })
}

// function add_user_to_group(req, res) {
//     if (req.user.role == 1) {
//         GROUPS.aggregate([{
//             $match: {
//                 'teacher_id': mongoose.Types.ObjectId(req.user._id),
//                 '_id': mongoose.Types.ObjectId(req.body.group_id),
//             }
//         }, ]).exec((err, result) => {
//             if (err || result.length == 0 || !req.body.student_id) {
//                 res.status(400).send({
//                     'error': 'Неправильные данные'
//                 }).end()
//             } else {
//                 USERS.findOne({ _id: mongoose.Types.ObjectId(req.body.student_id) }, (err, student) => {
//                     if (err) {
//                         res.status(400).send({
//                             'error': 'Не можем найти студента с таким id'
//                         }).end()

//                     } else {
//                         let newUserGroup = new USER_GROUP({
//                             user_id: mongoose.Types.ObjectId(student._id),
//                             group_id: mongoose.Types.ObjectId(req.body.group_id)
//                         })
//                         newUserGroup.save((err, newUserGroup) => {
//                             if (err) throw new Error(err)
//                             else {
//                                 GROUP_TIME.find({ group_id: mongoose.Types.ObjectId(req.body.group_id) }, (err, group_time) => {
//                                     group_time.map((value, index) => {
//                                         console.log(value)

//                                         newUserGroupTime = new USER_GROUP_TIME({
//                                             time_id: mongoose.Types.ObjectId(value._id),
//                                             group_user_id: mongoose.Types.ObjectId(newUserGroup._id)
//                                         })
//                                         newUserGroupTime.save((err, newUserGroupTime) => {

//                                             res.status(200).send(newUserGroupTime).end()
//                                         })

//                                     })
//                                 })
//                             }

//                         })

//                     }
//                 })


//             }
//         })
//     } else {
//         res.status(400).send({
//             'error': 'Только учитель может добавить нового ученика в группу'
//         }).end()

//     }

// }

// function get_group_time(req, res) {
//     GROUP_TIME.aggregate([{
//             $match: {
//                 group_id: mongoose.Types.ObjectId(req.params.group_id)
//             }
//         },
//         {
//             $sort: {
//                 startDate: 1
//             }
//         }
//     ]).exec((err, result) => {
//         if (err) throw new Error(err)
//         else {
//             res.status(200).send(result).end()
//         }
//     })

// }

// function get_time(text) {


// }
// // function get_group_time(req,res){
// //     GROUP_TIME.aggregate([
// // 		{
// // 	  		$match: {
// //                 group_id: mongoose.Types.ObjectId(req.params.group_id)
// // 	  		}
// // 		},
// // 		{
// // 			$sort: {
// // 				startDate: 1
// // 			}
// // 		}
// // 	]).exec((err, result) => {
// // 		if(err) throw new Error(err)
// // 		else {
// //             res.status(200).send(result).end()
// //         }
// //     })
// // }
// function get_users_in_group(req, res) {
//     USER_GROUP.aggregate([{
//             $match: {
//                 group_id: mongoose.Types.ObjectId(req.params.group_id)
//             }
//         },
//         {
//             $lookup: {
//                 from: 'user_group_times',
//                 localField: '_id',
//                 foreignField: 'group_user_id',
//                 as: 'time'
//             }
//         },
//         // {
//         // 	$lookup: {
//         // 		from: 'users',
//         //         localField: 'user_id',
//         //         foreignField: '_id',
//         //         as: 'user'
//         //     }
//         // }
//         // {
//         // 	$unwind: '$time'
//         // },
//         // {
//         //     $group:{
//         //         _id : {

//         //             "user_id": "$user_id",

//         //          },
//         //          info: {
//         //              $push:{
//         //                 "payment_status": "$payment_status",
//         //                 "group_id": "$group_id",
//         //                 "status": "$time.status",
//         //                 "time_id":"$time.time_id"

//         //              }
//         //          }


//         //     }
//         // }

//         // {
//         //     $lookup: {
//         //         from: 'group_times',
//         //         localField: 'time.time_id',
//         //         foreignField: '_id',
//         //         as: 'time.time_info'
//         //     }
//         // }
//         // ,
//         // {
//         //     $sort: {
//         //         	"time.time_info.startDate": -1
//         //         }
//         // }
//     ]).exec((err, result) => {
//         if (err) throw new Error(err)
//         else {
//             result.map((value, index) => {
//                 if (value['time']) {
//                     value['time'].map((time, id) => {
//                         GROUP_TIME.findOne({ _id: mongoose.Types.ObjectId(value['time'][id]['time_id']) }, (err, group_item) => {
//                             console.log(result[index]['time'][id])
//                             result[index]['time'][id]['aa'] = group_item
//                         })


//                     })
//                 }
//             })
//             res.status(200).send(result).end()
//         }
//     })

// }


module.exports = {
  create_event, get_my_event, get_all_events
   

}