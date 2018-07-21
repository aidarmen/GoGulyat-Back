const mongoose = require('mongoose')
const GROUPS = require('../models/group')
const USERS = require('../models/user')
const USER_GROUP = require('../models/user_group')
const GROUP_TIME = require('../models/group_time')
const USER_GROUP_TIME = require('../models/user_group_time')

const Config = require('../config/config')

function create_group(req, res) {
    if (req.user.role == 1) {
        let newGroup = new GROUPS({
            course_id: req.body.course_id,
            teacher_id: req.user._id,
            group_name: req.body.group_name,
            duration: req.body.duration,
            lessonDays: req.body.lessonDays,
            startDate: new Date(req.body.startDate),
            startTime: new Date(req.body.startTime),
            endTime: new Date(req.body.endTime)
        })
        newGroup.save((err, result) => {
            if (err) throw new Error(err)
            else {
                let time = new Date(req.body.startDate);
                var weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
                var dayInMilliseconds = 24 * 60 * 60 * 1000;


                for (let i = 0; i < 7; i++) {
                    if (result.lessonDays[i]) {
                        var LocalTime = new Date(time)
                        LocalTime.setTime(LocalTime.getTime() - weekInMilliseconds + dayInMilliseconds * i)
                        for (let j = 0; j < result.duration; j++) {
                            let timeItem = new Date(LocalTime.setTime(LocalTime.getTime() + weekInMilliseconds))
                            timeItem.setHours(new Date(result.startTime).getHours())
                            timeItem.setMinutes(new Date(result.startTime).getMinutes())

                            var startDate = new Date(timeItem)
                            timeItem.setHours(new Date(result.endTime).getHours())
                            timeItem.setMinutes(new Date(result.endTime).getMinutes())
                            var endTime = new Date(timeItem)



                            let newGroupTime = new GROUP_TIME({
                                group_id: result._id,
                                startDate: startDate,
                                endDate: endTime
                            })


                            newGroupTime.save((err, group_time) => {
                                if (err) throw new Error(err)
                                else {
                                    //console.log( i,j,group_time)
                                }
                            })
                        }
                    }
                }
                res.status(200).send(result).end()
            }
        })
    } else {
        res.status(400).send({
            'error': 'Только учитель может создать новую группу'
        }).end()

    }
}

function get_user_groups(req, res) {
    GROUPS.aggregate([
        { $match: { 'teacher_id': mongoose.Types.ObjectId(req.user._id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function get_course_groups(req, res) {
    GROUPS.aggregate([
        { $match: { 'course_id': mongoose.Types.ObjectId(req.params.course_id) } },
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })
}

function add_user_to_group(req, res) {
    if (req.user.role == 1) {
        GROUPS.aggregate([{
            $match: {
                'teacher_id': mongoose.Types.ObjectId(req.user._id),
                '_id': mongoose.Types.ObjectId(req.body.group_id),
            }
        }, ]).exec((err, result) => {
            if (err || result.length == 0 || !req.body.student_id) {
                res.status(400).send({
                    'error': 'Неправильные данные'
                }).end()
            } else {
                USERS.findOne({ _id: mongoose.Types.ObjectId(req.body.student_id) }, (err, student) => {
                    if (err) {
                        res.status(400).send({
                            'error': 'Не можем найти студента с таким id'
                        }).end()

                    } else {
                        let newUserGroup = new USER_GROUP({
                            user_id: mongoose.Types.ObjectId(student._id),
                            group_id: mongoose.Types.ObjectId(req.body.group_id)
                        })
                        newUserGroup.save((err, newUserGroup) => {
                            if (err) throw new Error(err)
                            else {
                                GROUP_TIME.find({ group_id: mongoose.Types.ObjectId(req.body.group_id) }, (err, group_time) => {
                                    group_time.map((value, index) => {
                                        console.log(value)

                                        newUserGroupTime = new USER_GROUP_TIME({
                                            time_id: mongoose.Types.ObjectId(value._id),
                                            group_user_id: mongoose.Types.ObjectId(newUserGroup._id)
                                        })
                                        newUserGroupTime.save((err, newUserGroupTime) => {

                                            res.status(200).send(newUserGroupTime).end()
                                        })

                                    })
                                })
                            }

                        })

                    }
                })


            }
        })
    } else {
        res.status(400).send({
            'error': 'Только учитель может добавить нового ученика в группу'
        }).end()

    }

}

function get_group_time(req, res) {
    GROUP_TIME.aggregate([{
            $match: {
                group_id: mongoose.Types.ObjectId(req.params.group_id)
            }
        },
        {
            $sort: {
                startDate: 1
            }
        }
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            res.status(200).send(result).end()
        }
    })

}

function get_time(text) {


}
// function get_group_time(req,res){
//     GROUP_TIME.aggregate([
// 		{
// 	  		$match: {
//                 group_id: mongoose.Types.ObjectId(req.params.group_id)
// 	  		}
// 		},
// 		{
// 			$sort: {
// 				startDate: 1
// 			}
// 		}
// 	]).exec((err, result) => {
// 		if(err) throw new Error(err)
// 		else {
//             res.status(200).send(result).end()
//         }
//     })
// }
function get_users_in_group(req, res) {
    USER_GROUP.aggregate([{
            $match: {
                group_id: mongoose.Types.ObjectId(req.params.group_id)
            }
        },
        {
            $lookup: {
                from: 'user_group_times',
                localField: '_id',
                foreignField: 'group_user_id',
                as: 'time'
            }
        },
        // {
        // 	$lookup: {
        // 		from: 'users',
        //         localField: 'user_id',
        //         foreignField: '_id',
        //         as: 'user'
        //     }
        // }
        // {
        // 	$unwind: '$time'
        // },
        // {
        //     $group:{
        //         _id : {

        //             "user_id": "$user_id",

        //          },
        //          info: {
        //              $push:{
        //                 "payment_status": "$payment_status",
        //                 "group_id": "$group_id",
        //                 "status": "$time.status",
        //                 "time_id":"$time.time_id"

        //              }
        //          }


        //     }
        // }

        // {
        //     $lookup: {
        //         from: 'group_times',
        //         localField: 'time.time_id',
        //         foreignField: '_id',
        //         as: 'time.time_info'
        //     }
        // }
        // ,
        // {
        //     $sort: {
        //         	"time.time_info.startDate": -1
        //         }
        // }
    ]).exec((err, result) => {
        if (err) throw new Error(err)
        else {
            result.map((value, index) => {
                if (value['time']) {
                    value['time'].map((time, id) => {
                        GROUP_TIME.findOne({ _id: mongoose.Types.ObjectId(value['time'][id]['time_id']) }, (err, group_item) => {
                            console.log(result[index]['time'][id])
                            result[index]['time'][id]['aa'] = group_item
                        })


                    })
                }
            })
            res.status(200).send(result).end()
        }
    })

}


module.exports = {
    create_group,
    get_user_groups,
    get_course_groups,
    add_user_to_group,
    get_group_time,
    get_users_in_group

}