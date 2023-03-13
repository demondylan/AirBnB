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
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"],
                subQuery: false,
            },
            {
                model: ReviewImage,
                required: false,
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
        res.status(404).json({ message: "Review couldn't be found", status: 404 })
    }

    if(review.userid === req.user.id){
        await review.destroy()
        res.json(review)
    }else{
        res.status(401).json({ message: "Must be the owner to delete the review", status: 404 })
    }
})


router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const reviewid = req.params.reviewId;
    const counting = req.params.reviewId;
    const { url } = req.body


    const reviews = await Review.findByPk(reviewid)
    if (!reviews) {
        res.status(403).json({ message: "User already has a review for this spot", status: 403 })
    }
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
        res.status(404).json({ message: "Review couldn't be found", status: 404 })
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
    const spots = await Spot.findAll({
        where: {
          id: id
        }
      })
      for await (let spot of spots) {
        const reviews = await Review.findAll({
                 where: {spotid: spot.id}
              })
        
              if (reviews.length) {
                 let sum = 0
        
                 reviews.forEach((review) => {
                 sum += review.stars
              })
                 sum = sum / reviews.length
                 spot.dataValues.AvgRatiing = sum
              } else {
                 spot.dataValues.AvgRatiing = 0
              }
              const previewImages = await SpotImage.findAll({
                where: {
                  spotid: req.user.id,
                   preview: true,
                },
                attributes: ["url"],
              });
              
              if (previewImages.length) {
                const image = previewImages.map((value) => value.url);
                spot.dataValues.previewImage = image[0];
              } else {
                spot.dataValues.previewImage = "No Image Url";
              }
        }
    return res.json(spots)

})

module.exports = router;