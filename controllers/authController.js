const userModel = require('../models/userModel')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

// REGISTER USER
const registerController = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.send({
                success: false,
                message: "User already exists ",
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password=hashedPassword

        const user = new userModel(req.body);
        await user.save();

        return res.send({
            success: true,
            message: "User registration successfull !",
            user
        })
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: "error in register controller",
            error
        })
    }
}

// LOGIN 
const loginController = async(req,res) => {
    try {
        const { role } = req.body;
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.send({
                success: false,
                message: "User not exists ",
            })
        }
        if (!role) {
            return res.send({
                success: false,
                message: "Role is required !",
            })
        }
        const comparePassword = await bcrypt.compare(req.body.password, user.password)
        if (!comparePassword) {
            return res.send({
                success: false,
                message: "Invalide Password ",
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.send({
            success: true,
            message: "Login SuccessFully !",
            token,
            user
        })
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: "error in login controller",
            error
        })
    }
}
// current User
const currentUserController = async(req,res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        return res.send({
            success: true,
            message: "Login SuccessFully !",
            user
        })
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: "error in current-User",
            error
        })
    }
}
module.exports = {registerController,loginController,currentUserController}