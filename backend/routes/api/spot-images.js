const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelized = require("sequelize");
const spot = require("../../db/models/spot");
const router = express.Router();


router.delete('/:spotImageId', async (req, res) => {
    const image = await SpotImage.findOne({
        where:{id: req.params.spotImageId},
        include: {model: Spot}
    })
    if (!image) {
        res.status(404).json({ message: "Spot Image couldn't be found", status: 404 })
    }
    if (image.Spot.dataValues.ownerId !== req.user.id) {
        res.status(401).json({ message: "Operation failed. You must be the owner of this image to delete it", status: 401 })
    }
    await image.destroy()
    return res.json({ message: 'Successfully deleted' })
})


module.exports = router;