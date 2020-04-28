const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dishSchema = require('./dishes').dishSchema

const favouriteSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        unique:true
    },
    dishes:[
        
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Dish',
        }
        
    ]
        
       
    
}, {
    timestamps:true
})

module.exports = mongoose.model('Favourite', favouriteSchema);