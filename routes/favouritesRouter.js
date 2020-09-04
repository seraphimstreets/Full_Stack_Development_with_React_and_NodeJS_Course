const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourites');
const Users = require('../models/user');
const Dishes = require('../models/dishes');

const favouriteRouter = express.Router()
favouriteRouter.use(bodyParser.json())

function checkId(list, id){
    for(var i=0;i<list.length;i++){
        if (list[i].equals(id)) return false
    }
    
    return true
}

favouriteRouter.route('/')
.options( cors.corsWithOptions, (req, res, next) => { res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites
    .findOne({"user": req.user._id})
    .populate('dishes')
    .populate('user')
    
    .then((favouriteList) => {
        if (favouriteList !== null){
           
            
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favouriteList)
            
          
        }else{
            err = new Error('Something went wrong!');
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites
    .findOne({user: req.user._id})
    .then((favourite) => {
        if (favourite != null){
            dishList = favourite.toObject().dishes
            console.log(dishList)
            

            for(var i=0;i<req.body.length;i++){
                if (checkId(dishList, req.body[i]._id)){
                    favourite.dishes.push(mongoose.Types.ObjectId(req.body[i]._id))
                    console.log('Favourite  ' + req.body[i]._id + ' inserted!')
                }else{
                    console.log('Already favourited!')
                    continue 
                }  
            }
            favourite.save()
            .then((fav) => {
                Favourites.findById(fav._id)
                .populate('user')
                .populate('dishes')
                .then((favourites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites)
                })
                
            })
            

            
            
        }else{
            
            var newDish = []
            for(var i=0;i<req.body.length;i++){
                console.log(req.body[i]._id)
                 newDish = [...newDish, mongoose.Types.ObjectId(req.body[i]._id)]
            }
            Favourites.create({user:req.user._id, dishes:newDish}).then((favourite) => {
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
                
            })
            
        }
    })
    .catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites
    .findOneAndDelete({user: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
    }, err => next(err))
    .catch(err => next(err))
})

favouriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res, next) => { res.sendStatus(200)})
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites.findOne({user: req.user._id})
    .then((favourites) => {
        if(!favourites){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
            return res.json({"exists":false, "favourites":favourites});
        }
        else{
            if (favourites.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                return res.json({"exists":false, "favourites":favourites});
            }
            else
            {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                return res.json({"exists":true, "favourites":favourites});
            }
        }
    }, (err) => next(err))
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites.findOne({user: req.user._id})
  
    .then((favourite) => {
        if (favourite !== null){
            dishList = favourite.toObject().dishes

            if (checkId(dishList, req.params.dishId))    favourite.dishes.push(mongoose.Types.ObjectId(req.params.dishId))
            else console.log('Dish has already been favourited!')
            
            favourite.save()
            .then((fav) => {
                
                Favourites.findById(fav._id)
                .populate('user')
                .populate('dishes')
                .then((favourites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourites)
                })
            })
            

            
            
        }else{
            var newDish = []
            for(var i=0;i<req.body.length;i++){
                console.log(req.body[i]._id)
                 newDish = [...newDish, mongoose.Types.ObjectId(req.body[i]._id)]
            }
            Favourites.create({user:req.user._id, dishes:newDish}).then((favourite) => {
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
                
            })
            
        }
    })
    .catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourites/:dishId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAuthor, (req,res,next) => {
    Favourites.findOne({user: req.user})
    
    .then((fav) => {
        dishList = fav.toObject().dishes
        if (fav != null && !checkId(dishList, req.params.dishId)){
            console.log(fav.dishes)
            Favourites.update( { user: req.user, dishes: mongoose.Types.ObjectId(req.params.dishId)},
            { $pull: { dishes: mongoose.Types.ObjectId(req.params.dishId)}})
            fav.save()
            .then((favourite) => {
                Favourites.findById(favourite._id)
                .populate('user')
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
                
            })
            
            
        }else if (fav != null && checkId(dishList, req.params.dishId)){
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err)
        }else{
            err = new Error('Favourites has not been created!')
            err.status = 404
            return next(err)
        }
    }, err => next(err))
    .catch(err => next(err))
})

module.exports = favouriteRouter