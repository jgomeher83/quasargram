const User = require('../models/User')

const getAllusers = async (req, res) => {
    try {
        users = await User.find({})
        res.status(200).json({ users })
    } catch (err) {
        console.log('error obteniendo todas los users');
        res.status(500).json({ msg: error })
    }
}

const signup = async (req, res) => {
    //backend
    try {
        const email = req.body.email
        const emailExists = await User.findOne({ email: email })
        if (emailExists) {
            return res.status(500).json({ msg: `este email: ${emailExists.email}, ya está en uso ` })
        }
        await User.create(req.body)
            .then(user => {
                res.status(201).json({ user })
            })
            .catch(err => {
                res.status(500).json({ err })
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({ err })
    }
}

const login = async (req, res) => {
    //backend
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({ email: email })
        if (user) {
            if (password !== user.password){
                return res.status(500).json({msg:`the password dond t match`, passError:true})
            }
            return res.status(200).json({ user })
        }
        res.status(500).json({msg:'the user does not exists', userNotFound:true})
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg:'error in bd connection',err })
    }
}

module.exports = {
    getAllusers,
    signup,
    login
}
