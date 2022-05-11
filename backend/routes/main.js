const express = require('express')
const router = express.Router()

// const {signup, login, getAllusers} = require('../controllers/users')

// //users
// router.route('/registration').post(signup)
// router.route('/login').post(login)
// router.route('/users').get(getAllusers)

//products
const {createPost, getAllPosts, getOnePost} = require('../controllers/posts')
router.route('/posts').get(getAllPosts)
router.route('/createPost').post(createPost)
router.route('/post/:id').get(getOnePost) //add patch and delete

// router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router

