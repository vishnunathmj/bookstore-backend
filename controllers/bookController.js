const books = require('../models/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SK);

// add book
exports.addBookController = async (req, res) => {
    console.log("inside addBookController");
    // get book details from req body
    const { title, author, imageURL, pages, price, discountPrice, abstract, publisher, isbn, language, category } = req.body
    const uploadImage = req.files.map(item => item.filename)
    const sellerMail = req.payload
    // console.log(title,author,imageURL,pages,price,discountPrice,abstract,publisher,isbn,language ,category,uploadImage,sellerMail);
    // check book exists or not
    const existingBook = await books.findOne({ title, sellerMail })
    if (existingBook) {
        // book already exixt
        res.status(409).json("Book Already exists!!")
    } else {
        // add book
        const newBook = await books.create({ title, author, imageURL, pages, price, discountPrice, abstract, publisher, isbn, language, category, uploadImage, sellerMail })
        res.status(201).json(newBook)
    }
}
// check book existing or not

// get latest books : get 4 books
exports.getHomeBookController = async (req, res) => {
    console.log("getHomeBookController");
    const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(homeBooks)
}

// get all books : ignore books uploades by logined user
exports.getAllBooksController = async (req, res) => {
    console.log("getAllBooksController");
    const loginUserMail = req.payload
    const searchKey = req.query.search
    const allBooks = await books.find({ sellerMail: { $ne: loginUserMail },title:{$regex:searchKey,$options:"i"}})
    res.status(200).json(allBooks)
}

// get logined user uploaded books
exports.getUserBooksController = async (req, res) => {
    console.log("getUserBooksController");
    const loginUserMail = req.payload
    const userBooks = await books.find({ sellerMail: loginUserMail })
    res.status(200).json(userBooks)
}


// get logined user purchased book
exports.getUserBroughtBooksController = async (req, res) => {
    console.log("getUserBroughtBooksController");
    const loginUserMail = req.payload
    const userBroughtBooks = await books.find({ buyerMail: loginUserMail })
    res.status(200).json(userBroughtBooks)
}

// delete book uploaded by logined user
exports.DeleteUploadBooksController = async (req, res) => {
    console.log("DeleteUploadBooksController");
    const {id} = req.params
    const deleteBooks = await books.findByIdAndDelete({_id:id})
    res.status(200).json(deleteBooks)
}

// get a single book to view
exports.viewBookController = async (req, res) => {
    console.log("viewBookController");
    const {id} = req.params
    const bookDetail = await books.findById({_id:id})
    res.status(200).json(bookDetail)
}


// get all books : admin page
exports.getAllBookController = async (req,res)=>{
    console.log("inside getAllBookController");
    const allBooks = await books.find()
    res.status(200).json(allBooks) 
}

// update book status : admin page
exports.updateBookStatusController = async (req,res)=>{
    console.log("inside getAllAdminBookController");
    const {id} = req.params
    const booksDetails = await books.findById({_id:id})
    bookDetails.status = "approved"
    await booksDetails.save()
    res.status(200).json(booksDetails) 
}

// book payment
exports.bookPaymentController = async (req,res)=>{
    console.log("inside bookPaymentController");
    const buyerMail = req.payload
    const {id} = req.params
    const bookDetails = await books.findById({_id:id})
    bookDetails.status = "sold"
    bookDetails.buyerMail = buyerMail
    await bookDetails.save()
    // Create stripe checkoutsession
    const line_items = [{
        price_data : {
            currency :"usd",
            product_data : {
                name : bookDetails.title,
                description : `${bookDetails.author},${bookDetails.publisher}`,
                // images : bookDetails.uploadImage,
                metadata : {
                    title:bookDetails.title,author:bookDetails.author,price:bookDetails.discountPrice
                }
            },
            unit_amount:Math.round(bookDetails.discountPrice)*100
        },
        quantity:1
    }]

    const session = await stripe.checkout.sessions.create({
        success_url : "http://localhost:5173/success",
        cancel_url : "http://localhost:5173/failed",
        line_items,
        mode: 'payment',
        allowed_payment_method_types :['card']
    })
    console.log(session);
    res.status(200).json({checkOutURL:session.url})


}