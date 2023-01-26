const express = require("express");
const {setTokenCookie, requireAuth} = require("../../utils/auth");
const {Spot, SpotImage, User, sequelize, Review} = require("../../db/models");
const {check} = require("express-validator");
const {handleValidationErrors} = require("../../utils/validation");
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