const express = require('express')
const Assessment = require('../models/assessment')
const auth = require('../middleware/auth')
const router = new express.Router()

//Create assessment
router.post('/assessment/new',auth,async (req,res) => {
    const assessment = new Assessment({
        ...req.body,
        owner: req.user._id
    })
    try {
        await assessment.save()
        res.status(201).send({
            assessment, message:"Assessment added"})
    } catch(error) {
        res.status(500).send(error)
    }
})
// Get all assessments
router.get('/assessments/get',auth, async (req,res) => {
    try {
        await req.user.populate("assessments")
        res.status(200).send(req.user.assessments)
    } catch(error) {
        res.status(500).send(error)
    }
})
// Get one note by id
router.get('/assessments/:id',auth, async (req,res) => {
    try {
        const assessment = await Assessment.findById({_id: req.params.id})
        if(!assessment) {
            return res.status(404).send()
            res.send(assessment)
        }
    } catch {
        res.status(500).send(error)
    }
})
// Delete assessment
router.delete('/assessments/:id',auth, async (req, res) => {
    try {
        const assessment = await Assessment.findOneAndDelete({_id: req.params.id})
        if(!assessment) {
            res.status(404).send()
        }
        res.send({message: "Assessment Deleted"})
    } catch(error) {
        res.status(500).send(error)
    }
})
module.exports = router