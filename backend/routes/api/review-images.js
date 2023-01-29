const express = require("express");
const {setTokenCookie, requireAuth} = require("../../utils/auth");
const {Spot, SpotImage, User, sequelize, Review, ReviewImage, Booking} = require("../../db/models");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
const sequelized = require("sequelize");
const spot = require("../../db/models/spot");
const router = express.Router();



router.delete('/:reviewImageId', async (req, res) => {
    const image = await ReviewImage.findByPk(req.params.reviewImageId)
    if(!image) {
        res.status(404).json({message: "Review Image couldn't be found"})
    }
    await image.destroy()
   return res.json({message: 'Successfully deleted'})
})


module.exports = router;