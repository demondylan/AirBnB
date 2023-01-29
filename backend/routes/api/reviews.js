const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const sequelized = require("sequelize");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true, min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.get('/current', requireAuth, async (req, res) => {
    const reviews = await Review.findAll({
        where: {
            userid: req.user.id
        },

        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
                subQuery: false,
            },
            {
                model: Spot,
                attributes: ["id", "ownerid", "address", "city", "state", "country", "lat", "lng", "name", "price"],
                subQuery: false,
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
                subQuery: false,
            }
        ]
    })
    res.json({ Review: reviews })
})

router.delete('/:reviewsId', async (req, res) => {
    const review = await Review.findByPk(req.params.reviewsId)
    if (!review) {
        res.status(404).json({ message: "Review couldn't be found" })
    }
    await review.destroy()
    return res.json({ message: 'Successfully deleted' })
})


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewid = req.params.reviewId;
    const counting = req.params.reviewId;
    const { url } = req.body


    const reviews = await Review.findByPk(reviewid)
    if (!reviews) {
        const err = new Error(`Review couldn't be found`);
        err.status = 404;
        err.title = "Review id does not exist";
        //  err.errors = ["Spot couldn't be found"];
        return next(err);
    }

    //   const count = await ReviewImage.count({where: {counting}})

    /*   if (count >= 10) {
         return res.status(403).json({ Message: "Maximum number of images for this resource was reached",
         statusCode: 403
     })
       }*/
    const newImage = await ReviewImage.create({
        reviewid: reviewid,
        url
    })

    return res.json(newImage)
})

router.put('/:reviewsid', requireAuth, validateReview, async (req, res, next) => {
    const id = req.params.reviewsid;
    const reviews = await Review.findByPk(id)
    if (!reviews) {
        const err = new Error(`Review couldn't be found`);
        err.status = 404;
        err.title = "Review id does not exist";
        return next(err);
    }

    await reviews.update({
        review: req.body.address,
        stars: req.body.city,
        createdAt: sequelized.literal("CURRENT_TIMESTAMP"),
        updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
    });

    await reviews.save
    return res.json(reviews)

});
router.get('/:spotId/reviews', async (req, res, next) => {
    const id = req.params.spotId;
    const spots = await Spot.findByPk(id, {
        attributes: {
            include: [
                [sequelize.fn("COUNT", sequelize.col("Reviews.spotid")),
                    "numReviews"
                ],
                [sequelize.fn("ROUND", sequelize.fn("AVG", sequelize.col("Reviews.stars")), 1),
                    "avgStarRating"
                ]
            ]
        },


        include: [
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]
            },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Review,
                attributes: [],
                subQuery: false,
            },
        ],

    })
    if (spots.id === null) {
        const err = new Error(`Spot Id ${id} does not exist`);
        err.status = 404;
        err.title = "Spot couldn't be found";
        //  err.errors = ["Spot couldn't be found"];
        return next(err);
    }
    return res.json(spots)

})

module.exports = router;