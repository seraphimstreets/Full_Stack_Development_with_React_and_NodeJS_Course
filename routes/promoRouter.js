const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.header('Content-Type', 'text/plain');
    next()
})
.get( (req,res,next) => {
    res.end('Sending all the promotions')
}
    
)
.post((req,res,next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: '
    + req.body.description)
}
   
)
.put((req,res,next) => {
    res.statusCode = 403
    res.end('PUT operation not supported for /promos')
})
.delete((req,res,next) =>{
    res.end('Deleting all promotions');
});

promoRouter.route('/:promoId')
.get((req,res,next) => {
    res.statusCode = 200;
    res.header('Content-Type', 'text/plain');
    res.end('Retrieving promotion ' + req.params.promoId )
})
.post((req,res,next) => {
    res.statusCode = 403
    res.end('POST operation not supported for promos/' + req.params.promoId )
})
.put((req,res,next) => {
    res.statusCode = 403
    res.write('Updating promotion ' + req.params.promoId + '\n');
    res.end('Updating the promotion ' + req.params.promoId + ' with name '
    + req.body.name + ' and description: ' + req.body.description)
})
.delete((req,res,next) => {
    res.statusCode = 200;
    res.header('Content-Type', 'text/plain');
    res.end('Deleting promotion ' + req.params.promoId )
});
module.exports = promoRouter;