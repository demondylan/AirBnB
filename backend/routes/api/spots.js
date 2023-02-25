const express = require("express");
<<<<<<< Updated upstream
const {setTokenCookie, requireAuth} = require("../../utils/auth");
const {Spot, SpotImage, User, sequelize, Review} = require("../../db/models");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
=======
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User, sequelize, Review, ReviewImage, Booking } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors, handleDateValidation } = require("../../utils/validation");
>>>>>>> Stashed changes
const sequelized = require("sequelize");
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
<<<<<<< Updated upstream
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true, min: -90, max: 90  })
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({ checkFalsy: true, min: -180, max: 180 })
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

=======
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
const validateDate = [
check('startDate')
      .trim()
      .custom((startDate, { req }) => {
          const [sy, sm, sd] = startDate.split('-')
          const [ey, em, ed] = req.body.endDate.split('-')
          const start = new Date(sy, sm, sd)
          const end = new Date(ey, em, ed)
          if (start >= end) {
              throw new Error(
'Start date of project must be before End date')
          }
          return true
      }),
      handleDateValidation
    ]
>>>>>>> Stashed changes
router.get('/', async (req, res) => {
    const spots = await Spot.findAll()
    res.json(spots)
})

router.get('/:spotid', async (req, res, next) => {
    const id = req.params.spotid;
    const spots = await Spot.findByPk(id, {
        attributes: {
            include: [
         [sequelize.fn("COUNT", sequelize.col("Reviews.spotid")),
        "numReviews"
        ],
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")),
        "avgStarRating"
        ]
    ]}, 


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
    
<<<<<<< Updated upstream
      })
      if (spots.id === null) 
      {
          const err = new Error(`Spot Id ${id} does not exist`);
          err.status = 404;
          err.title = "Spot couldn't be found";
        //  err.errors = ["Spot couldn't be found"];
          return next(err);
        }
    res.json(spots)
    
=======
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
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }
    const reviews = await Review.findAll({
             where: {spotid: id}
          })
          spots.dataValues.numReviews = reviews.length
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

>>>>>>> Stashed changes
})


router.get('/session', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerid: req.user.id
          }
    })
    res.json(spots)
})

router.post('/', requireAuth, validateSpot, async (req, res) => {
<<<<<<< Updated upstream
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
   
    res.json(newSpot)
=======
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
      res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }

  const reviews = await Review.findOne({ where: { userid: req.user.id } });
  if (reviews != null) {
    res.status(403).json({ message: "Review exists", status: 403 })
  }

  const newReview = await Review.create({
    userid: req.user.id,
    spotid: id,
    review,
    stars
  })

  return res.json(newReview)

})

router.post('/:spotIdForBooking/bookings', requireAuth, validateDate, async (req, res, next) => {
  const id = req.params.spotIdForBooking;
  const { user, spotid, startDate, endDate } = req.body

  const [sd, sm, sy] = startDate.split('/')
  const [ed, em, ey] = endDate.split('/')

  const spots = await Spot.findByPk(id)
  if (spots === null) {
    res.status(404).json({ message: "Spot couldn't be found", status: 404 })
  }

  const bookings = await Booking.findOne({ where: { userid: req.user.id } });
  /*if (bookings != null) {
    res.status(403).json({ message: "Booking exists", status: 403 })
  }*/
 /* const booking = await Booking.findAll({ where: {
    [Op.or]: [{
        from: {
            [Op.between]: [startDate, endDate]
        }
    }, {
        to: {
            [Op.between]: [startDate, endDate]
        }
    }]
  }
});
if (booking != null) {
  res.status(403).json({ message: "Sorry, this spot is already booked for the specified dates", status: 403 })
}*/

  const newBooking = await Booking.create({
    userid: req.user.id,
    spotid: id,
    startDate,
    endDate
  })

  return res.json(newBooking)
>>>>>>> Stashed changes

})
router.post('/:spotsid/images', requireAuth, async (req, res, next) => {
    const id = req.params.spotsid;
    const { url, preview } = req.body

    
    const spots = await Spot.findByPk(id)
      if (spots === null) 
      {
          const err = new Error(`Spot Id ${id} does not exist`);
          err.status = 404;
          err.title = "Spot couldn't be found";
        //  err.errors = ["Spot couldn't be found"];
          return next(err);
        }
        const newImage = await SpotImage.create({
            spotid: id,
            url,
           preview
        })

    res.json(newImage)
})


router.put('/:spotsid', requireAuth, async (req, res) => {
    const id = req.params.spotsid;
    const spots = await Spot.findByPk(id)
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
        updatedAt: sequelized.literal("CURRENT_TIMESTAMP")
    });

    await spots.save
    res.json(spots)

});


module.exports = router;