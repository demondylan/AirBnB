const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const sequelized = require("sequelize");
const { Op } = require("sequelize")
const image = require("../../db/models/reviewimage");
const spot = require("../../db/models/spot");
const router = express.Router();



const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];


const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true, min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

router.get('/', async (req, res, next) => {
  let { page, size, minPrice, maxPrice } = req.query
  if (page <= 0) {
    res.status(400)
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Page must be greater than or equal to 1"
      }
    })
  }
  if (size <= 0) {
    res.status(400)
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Size must be greater than or equal to 1"
      }
    })
  }
  if (maxPrice < 0) {
    res.status(400)
    return res.json({
      message: "Validation Error",
      statusCode: 400,
      errors: {
        page: "Maximum price must be greater than or equal to 0"
      }
    })
  }
  if (!page || isNaN(page) || page > 10) { page = 1 }
  if (!size || isNaN(size) || size > 20) { size = 20 }
  if (!minPrice) { minPrice = 1 }
  if (!maxPrice) { maxPrice = 100000 }
  page = Number(page)
  size = Number(size)
  const spots = await Spot.findAll({
    where: {
      price: { [Op.between]: [minPrice, maxPrice] },
    },
    include: [
      {model: SpotImage},
      {model: Review},
  ],
    limit: size,
    offset: (page - 1) * size,
  })
  spots.forEach(spot => {
    spot.SpotImage.forEach(image => {
      if (image.dataValues.previewImage) {
        spot.dataValues.previewImage = image.url
      }
      delete spot.dataValues.SpotImage
    })
      let sum = 0
        spot.Reviews.forEach(review => {
          sum += review.dataValues.stars
        })
        sum = sum/spot.Reviews.length
        spot.dataValues.avgRating = sum
      delete spot.dataValues.Reviews
      if (!spot.dataValues.previewImage){
        spot.dataValues.previewImage = "No preview image"
    }
    })
    page = parseInt(page)
    size = parseInt(size)
  res.json(spots)
})
router.get('/:spotsId/reviews', async (req, res, next) => {
  const id = req.params.spotsId;
  const spot = await Spot.findByPk(id)
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }
  const reviews = await Review.findAll({
    where: {
      spotid: id
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        subQuery: false,
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
        subQuery: false,
      },
    ]

  })
  return res.json(reviews)
})
router.get('/:spotIdForBooking/bookings', async (req, res, next) => {
  const id = req.params.spotIdForBooking;
  const spot = await Spot.findByPk(id)
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }
  const bookings = await Booking.findAll({
    where: {
      spotid: id
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        subQuery: false,
      },
    ]

  })
  return res.json(bookings)
})

router.get('/current', requireAuth, async (req, res) => {

  const spots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    }
  })
  for await (let spot of spots) {
    const reviews = await Review.findAll({
      where: { spotid: spot.id }
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
        spotId: req.user.id,
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
  res.json({ Spots: spots })
})

router.get('/:spotid', async (req, res, next) => {
  const id = req.params.spotid;
  const spots = await Spot.findOne({
    where:{
        id: id
    },
    include:[
        {model: Review},
        {model: SpotImage},
        {model: User, as: "Owner"}
    ]
});
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }
  let sum = 0
  let count = 0
  spots.Reviews.forEach(review => {
    sum += review.dataValues.stars
    count++
  })

  sum = sum/spots.Reviews.length
  spots.dataValues.avgRating = sum
  spots.dataValues.totalReviews = count
delete spots.dataValues.Reviews
  return res.json(spots)
})


router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }
  if(spot.ownerId === req.user.id){
  await spot.destroy()
  return res.json(spot)
} else {
  res.status(401).json({ message: "You must be the owner to delete the Spot", status: 401 })
}
})

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  // console.log(user)

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })
  return res.json(newSpot)

})
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const id = req.params.spotId;
  const spots = await Spot.findByPk(id)
  if (spots === null) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }

  const reviews = await Review.findAll({ where: { [Op.and]: [{ userId: req.user.id }, { spotId: req.params.spotId }] } })
  if (reviews) {
    res.status(403).json({ message: "Review exists", status: 403 })
  } else {

  const { review, stars } = req.body

  const newReview = await Review.create({
    userid: req.user.id,
    spotid: Number(req.params.spotId),
    review: review,
    stars: stars
  })

  return res.json(newReview)
  }
})

router.post('/:spotIdForBooking/bookings', requireAuth, async (req, res, next) => {
  const id = req.params.spotIdForBooking;
  const { user, spotid, startDate, endDate } = req.body
  const spots = await Spot.findByPk(id)
  if (spots === null) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }

  const bookings = await Booking.findOne({ where: { userid: req.user.id } });
  if (bookings != null) {
    res.status(403).json({ message: "Booking exists", status: 403 })

  }

  const newBooking = await Booking.create({
    userid: req.user.id,
    spotid: id,
    startDate,
    endDate
  })

  return res.json(newBooking)

})
router.post('/:spotsid/images', requireAuth, async (req, res, next) => {
  const id = req.params.spotsid;
  const spots = await Spot.findByPk(id)
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  } else {
    if (spots.ownerId === req.user.id) {
      const { url, previewImage } = req.body
  const newImage = await SpotImage.create({
    spotId: id,
    url: url,
    previewImage: previewImage
  })

  res.json({
    id: newImage.id,
    url: newImage.url,
    previewImage: newImage.previewImage
})
}
if (spots.ownerId !== req.user.id) {
  res.status(401).json({ message: "Unauthorized action. Only the spot owner can add new image", status: 401 })
}
}

})


router.put('/:spotsid', requireAuth, async (req, res, next) => {
  const id = req.params.spotsid;
  const spots = await Spot.findByPk(id)
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }

  await spots.update({
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    lat: req.body.lat,
    lng: req.body.lng,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    createdAt: sequelized.literal("CURRENT_TIMESTAMP"),
    updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
  });

  await spots.save
  return res.json(spots)

});


module.exports = router;