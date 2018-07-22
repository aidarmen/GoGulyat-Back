// const COURSES = require('../models/course')
// const GROUPS = require('../models/group')
// const Config = require('../config/config')
// const mongoose = require('mongoose')



// function get_courses(req, res) {
//     console.log(123)
//     GROUPS.aggregate([
//         { $match: { 'teacher_id': mongoose.Types.ObjectId(req.user._id) } },
//         {
//             $lookup: {
//                 from: 'courses',
//                 localField: 'course_id',
//                 foreignField: '_id',
//                 as: 'course'
//             }
//         },
//         {
//             $unwind: '$course'
//         },
//         {
//             $group: {
//                 _id: {
//                     "course_id": "$course._id",
//                     "course_name": "$course.course_name"
//                 }
//             }
//         }
//     ]).exec((err, result) => {
//         if (err) throw new Error(err)
//         else {
//             console.log(4444, result)
//             res.status(200).send(result).end()

//         }
//     })



// }

// function get_all_courses(req, res) {
//     COURSES.find({}, (err, result) => {
//         if (err) throw new Error(err)
//         else {
//             res.status(200).send(result).end()
//         }
//     })
// }

// function create_courses(req, res) {
//     // console.log(req.body.course_img)
//     let newCourse = new COURSES({
//         course_name: req.body.course_name,
//         course_img: req.body.course_img

//     })
//     newCourse.save((err, result) => {
//         if (err) throw new Error(err)
//         else {
//             res.status(200).send(result).end()
//         }
//     })

// }








// module.exports = {
//     get_courses,
//     get_all_courses,
//     create_courses
// }