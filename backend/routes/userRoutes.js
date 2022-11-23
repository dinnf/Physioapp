const express = require('express')
const User = require('../models/user')
const auth = require("../middleware/auth")
const router = new express.Router()
// Create user
router.post('/users/create',async(req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user,token,message:"New Account Created"})
    } catch(error) {
        console.log(error);
        if (user.password.length <6) {
            res.status(400).send({
                message:"Password must be at least 6 characters"
            })
        } else if (error.keyPattern.username ==1) {
            res.status(400).send({
                message:"Username already taken"
            })
        } else {res.status(500).send({
            message:"Something went wrong"
        })}
    
    }
})
// Login user
router.post('/user/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user: token})
    } catch(error) {
        res.status(500).send({message: "Unable to login"})
    }
})
// Logout user
router.post('/user/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send({ message: "Logged Out"})
    } catch(error) {
        res.status(500).send(error)
    }
})
// Get user details
router.get('/users/me',auth, async (req,res) => {
    res.send(req.user)
})
// Delete user
router.delete('/users/delete',auth, async (req, res) => {
    try {
        req.user.remove()
        res.send({message:"Account deleted"
        })
    } catch(error) {
        res.status(500).send(error)
    }
})
module.exports = router