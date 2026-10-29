const express = require('express')
const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const authMiddleware = require('../middleware/authMiddleware')
const MulterMiddleware = require('../middleware/MulterMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')



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

// get user uploaded books
router.get('/user-books',authMiddleware,bookController.getUserBooksController)

// get user brought books
router.get('/brought-books',authMiddleware,bookController.getUserBroughtBooksController)

// delete book user uploaded
 router.delete('/book/:id',authMiddleware,bookController.DeleteUploadBooksController)

 // view single book uploaded
 router.get('/view-book/:id',authMiddleware,bookController.viewBookController)

 // book payment
 router.put('/books/:id/buy',authMiddleware,bookController.bookPaymentController)


 // --------------------------------- AUTHERIZED ACCESS :ADMIN ------------------------------

//  edit admin
 router.put('/admin/:id',adminMiddleware,MulterMiddleware.single('picture'),userController.userEditController)

// get all users
 router.get('/user-list',adminMiddleware,userController.getAllUsersController)

//  get all book for admin
router.get('/book-list',adminMiddleware,bookController.getAllBookController)

// update book stsus admin side
router.get('/book/:id',adminMiddleware,bookController.updateBookStatusController)

module.exports = router