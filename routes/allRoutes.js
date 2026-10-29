const express = require('express')
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const authMiddleware = require('../middleware/authMiddleware')
const MulterMiddleware = require('../middleware/MulterMiddleware')


// object for router classs in express
const router = new express.Router()

// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// google login
router.post('/google-login',userController.googleLoginController)

// home 4 books displaying 
router.get('/home-books',bookController.getHomeBookController)



// --------------------------------- AUTHERIZED ACCESS ------------------------------

// user edit
router.put('/user/:id',authMiddleware,MulterMiddleware.single('picture'),userController.userEditController)

// Add book
router.post('/book',authMiddleware,MulterMiddleware.array('uploadImage',3),bookController.addBookController)

// get all books
router.get('/all-books',authMiddleware,bookController.getAllBooksController)

module.exports = router