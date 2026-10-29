const books = require('../models/bookModel')

// add book
exports.addBookController = async(req,res)=>{
    console.log("inside addBookController");
    // get book details from req body
    const {title,author,imageURL,pages,price,discountPrice,abstract,publisher,isbn,language ,category} = req.body
    const uploadImage=req.files.map(item=>item.filename)
    const sellerMail = req.payload
    // console.log(title,author,imageURL,pages,price,discountPrice,abstract,publisher,isbn,language ,category,uploadImage,sellerMail);
    // check book exists or not
    const existingBook = await books.findOne({title,sellerMail})
    if(existingBook){
        // book already exixt
        res.status(409).json("Book Already exists!!")
    }else{
        // add book
        const newBook = await books.create({title,author,imageURL,pages,price,discountPrice,abstract,publisher,isbn,language ,category,uploadImage,sellerMail})
        res.status(201).json(newBook)
    }
}
    // check book existing or not

// get latest books : get 4 books
exports.getHomeBookController = async(req,res)=>{
    console.log("getHomeBookController");
    const homeBooks = await books.find().sort({_id:-1}).limit(4)
    res.status(200).json(homeBooks)
}


// get all books : ignore books uploades by logined user
exports.getAllBooksController = async (req,res)=>{
    console.log("getAllBooksController");
    const loginUserMail = req.payload
    const allBooks = await books.find({sellerMail:{$ne:loginUserMail}})
    res.status(200).json(allBooks)
}

// get logined user uploaded books

// get logined user purchased book

// get a single book to view

// delete book by loginned user

// get all books : admin page

// update book status : admin page 

// book payment