const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

const Promotions = require('../models/promotions');

promoRouter.route('/')

.get( (req,res,next) => {
    Promotions.find({})
    .then((promos) =>{
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(promos)
    }, err => next(err))
    .catch(err => next(err))
})
.post((req,res,next) => {
    Promotions.create(req.body)
    .then((promo) => {
        console.log('Promotion created ', promo)
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(promo)
    }, err => next(err))
    .catch(err => next(err));
}
   
)
.put((req,res,next) => {
    res.statusCode = 403
    res.end('PUT operation not supported for /promos')
})
.delete((req,res,next) =>{
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err));
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(promo)
    }, err => next(err))
    .catch(err => next(err));
})
.post((req,res,next) => {
    res.statusCode = 403
    res.end('POST operation not supported for promos/' + req.params.promoId )
})
.put((req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {$set: req.body}, {new:true})
    .then((promo) => {
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(promo)
    }, err => next(err))
    .catch(err => next(err));
})
.delete((req,res,next) => {
    Promotions.findByIdAndDelete(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200
        res.header('Content-Type', 'text/plain');
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err));
});
module.exports = promoRouter;