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

router.get('/', async (req, res) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
  if (!page || Number.isNaN(page) || page > 10) { page = 1 }
  if (!size || Number.isNaN(size) || size > 20) { size = 20 }
  if (!minLat) { minLat = -90 }
  if (!maxLat) { maxLat = 90 }
  if (!minLng) { minLng = -180 }
  if (!maxLng) { maxLng = 180 }
  if (!minPrice) { minPrice = 1 }
  if (!maxPrice) { maxPrice = 100000 }
  page = Number(page)
  size = Number(size)
  console.log(page,size, "!!!!!!!!!!!!!")
  const spots = await Spot.findAll({
      where: {
          lat: { [Op.between]: [minLat, maxLat] },
          lng: { [Op.between]: [minLng, maxLng] },
          price: { [Op.between]: [minPrice, maxPrice] },
      },
/*
      attributes: {
          include: [[sequelize.fn('COALESCE', sequelize.fn('AVG',
           sequelize.col('Reviews.stars')), 0), 'avgRating'],
          [sequelize.fn('COALESCE', sequelize.col('SpotImages.url'),
           sequelize.literal("'no image preview has been uploaded'")),
            'previewImage']]
            */
          /*
          COALESCE returns the first non null val
          using to grab the star if there is only one review
          then if more then one value finds the avg of the stars on the review table
          passing 0 as a defult value then returnin the avg to the spots table
         
          */
      //},
      include: [{
          model: Review,
      },
      {
          model: SpotImage,
      }],
      //group: ['Spot.id', 'SpotImages.url'],
      offset: (page - 1) * size ,
      limit: size
      })
     spots.forEach(spot =>{
      spot.SpotImages.forEach(image=>{
          if (image.dataValues.preview){
              spot.dataValues.previewImage = image.url
          }else{
              spot.dataValues.previewImage = "no preview Image"
          }
          delete spot.dataValues.SpotImages
          let sum = 0
          if (spot.Reviews.length){
              spot.Reviews.forEach(review =>{
              sum += review.dataValues.stars
              })
              sum = sum/spot.Reviews.length
              spot.dataValues.avgRating = sum
          }else{
              spot.dataValues.avgRating = sum
          }
          delete spot.dataValues.Reviews
      })
     })
  res.json({
      Spots:spots,
      page,
      size
})
})
router.get('/:spotsId/reviews', async (req, res, next) => {
  const id = req.params.spotsId;
  const spot = await Spot.findByPk(id)
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" })
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
    res.status(404).json({ message: "Spot couldn't be found" })
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
      ownerid: req.user.id
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
  res.json({ Spots: spots })
})

router.get('/:spotid', requireAuth, async (req, res, next) => {
  const id = req.params.spotid;
  const spots = await Spot.findByPk(id)
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found" })
  }
    const reviews = await Review.findAll({
             where: {spotid: id}
          })
    
          if (reviews.length) {
             let sum = 0
    
             reviews.forEach((review) => {
             sum += review.stars
          })
             sum = sum / reviews.length
             spots.dataValues.AvgRating = sum
          } else {
             spots.dataValues.AvgRating = 0
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
            spots.dataValues.previewImage = image[0];
          } else {
            spots.dataValues.previewImage = "No Image Url";
          }
    



  return res.json(spots)

})


router.delete('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId)
  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" })
  }
  await spot.destroy()
  return res.json({ message: 'Successfully deleted' })
})

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { user, address, city, state, country, lat, lng, name, description, price } = req.body
  // console.log(user)

  const newSpot = await Spot.create({
    ownerid: req.user.id,
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
  res.status(201)
  return res.json(newSpot)

})
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  const id = req.params.spotId;
  const { user, spotid, review, stars } = req.body
  const spots = await Spot.findByPk(id)
  if (spots === null) {
      res.status(404).json({ message: "Spot couldn't be found" })
  }

  const reviews = await Review.findOne({ where: { userid: req.user.id } });
  if (reviews != null) {
    res.status(403).json({ message: "Review exists" })
  }

  const newReview = await Review.create({
    userid: req.user.id,
    spotid: id,
    review,
    stars
  })

  return res.json(newReview)

})

router.post('/:spotIdForBooking/bookings', requireAuth, async (req, res, next) => {
  const id = req.params.spotIdForBooking;
  const { user, spotid, startDate, endDate } = req.body
  const spots = await Spot.findByPk(id)
  if (spots === null) {
    res.status(404).json({ message: "Spot couldn't be found" })
  }

  const bookings = await Booking.findOne({ where: { userid: req.user.id } });
  if (bookings != null) {
    res.status(403).json({ message: "Booking exists" })

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
  const { url, preview } = req.body


  const spots = await Spot.findByPk(id)
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found" })
  }
  const newImage = await SpotImage.create({
    spotid: id,
    url,
    preview
  })

  return res.json(newImage)
})


router.put('/:spotsid', requireAuth, async (req, res, next) => {
  const id = req.params.spotsid;
  const spots = await Spot.findByPk(id)
  if (!spots) {
    res.status(404).json({ message: "Spot couldn't be found" })
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