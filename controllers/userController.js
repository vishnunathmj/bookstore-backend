const bcrypt = require('bcrypt')
const users = require('../models/userModel')
const jwt = require('jsonwebtoken')


// register
exports.registerController = async (req, res) => {
    console.log("Inside registerController");
    console.log(req.body);
    const { username, email, password } = req.body
    // check email is in DB
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        res.status(409).json("User already Exist")
    }
    else {
        // insert new doc to DB
        let encryptPassword = await bcrypt.hash(password, 10)
        const newUser = await users.create({
            username, email, password: encryptPassword
        })
        res.status(201).json(newUser)
    }

    res.status(201).json("Register Request Recevied")

}

// login
exports.loginController = async (req, res) => {
    console.log("Inside loginController");
    const { email, password } = req.body
    // check email in DB
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        // check password
        const isPasswordMatch = await bcrypt.compare(password, existingUser.password)
        if (isPasswordMatch) {
            const token = jwt.sign({ userMail: email, role: existingUser.role }, process.env.JWTSECRET)
            res.status(200).json({ user: existingUser, token })
        }
        else {
            res.status(409).json("Invaild password!!")
        }
    } else {
        res.status(409).json("Invaild Email!! Please Register")
    }



}

// google login
exports.googleLoginController = async (req, res) => {
    console.log("Inside googleloginController");
    const { email, password, picture, username } = req.body
    // check email in DB
    const existingUser = await users.findOne({ email })
    if (existingUser) {
        //  if present
        const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.JWTSECRET)
        res.status(200).json({ user: existingUser, token })
    } else {
        // if not present- register user
        let encryptPassword = await bcrypt.hash(password, 10)
        const newUser = await users.create({
            username, email, password: encryptPassword, picture
        })
        const token = jwt.sign({ userMail: newUser.email, role: newUser.role }, process.env.JWTSECRET)
        res.status(200).json({ user: existingUser, token })
    }
}

// edit user
exports.userEditController = async (req, resp) => {
    console.log("Inside userEditController");
    const {id} = req.params
    const email = req.payload
    const {username,password,bio,picture,role} = req.body
    const encryptPassword = await bcrypt.hash(password,10)
    const uploadedPicture = req.file ? req.file.filename : picture;
    const updatedUser = await users.findByIdAndUpdate({_id:id},{username,email,password:encryptPassword,picture:uploadedPicture,bio,role},{new:true})
    resp.status(200).json(updatedUser)
    // console.log(req.payload);
    // console.log(req.body);
}
// edit admin