const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelized = require("sequelize");
const image = require("../../db/models/reviewimage");
const spot = require("../../db/models/spot");
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Booking.findAll({
        where: {
            userid: req.user.id
        },

        include: [
            {
                model: Spot,
                attributes: ["id", "ownerid", "address", "city", "state", "country", "lat", "lng", "name", "price"],
                subQuery: false,
            }
        ]
    })
    res.json(reviews)
})


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingId;
    const bookings = await Booking.findByPk(id)
    if (!bookings) {
        res.status(404).json({ message: "Booking couldn't be found" })
    }

    await bookings.update({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        createdAt: sequelized.literal("CURRENT_TIMESTAMP"),
        updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
    });

    await bookings.save
    return res.json(bookings)

});

router.delete('/:bookingId', async (req, res) => {
    const booking = await Booking.findByPk(req.params.bookingId)
    if (!booking) {
        res.status(404).json({ message: "Booking couldn't be found" })
    }
    await booking.destroy()
    return res.json({ message: 'Successfully deleted' })
})

module.exports = router;