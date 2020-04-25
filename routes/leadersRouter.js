const express = require('express');
const bodyParser = require('body-parser');

const leadersRouter = express.Router()
leadersRouter.use(bodyParser.json())

leadersRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200
    res.header('Content-Type', 'text/plain');
    next()
})
.get( (req,res,next) => {
    res.end('Sending all the leaders')
}
    
)
.post((req,res,next) => {
    res.end('Will add the leaders: ' + req.body.name + ' with details: '
    + req.body.description)
}
   
)
.put((req,res,next) => {
    res.statusCode = 403
    res.end('PUT operation not supported for /leaders')
})
.delete((req,res,next) =>{
    res.end('Deleting all leaders');
});

leadersRouter.route('/:leaderId')
.get((req,res,next) => {
    res.statusCode = 200;
    res.header('Content-Type', 'text/plain');
    res.end('Retrieving leaders ' + req.params.leaderId )
})
.post((req,res,next) => {
    res.statusCode = 403
    res.end('POST operation not supported for leaders/' + req.params.leaderId )
})
.put((req,res,next) => {
    res.statusCode = 403
    res.write('Updating leader ' + req.params.leaderId + '\n')
    res.end('Updating the leader ' + req.params.leaderId + ' with name '
    + req.body.name + ' and description: ' + req.body.description)
})
.delete((req,res,next) => {
    res.statusCode = 200;
    res.header('Content-Type', 'text/plain');
    res.end('Deleting leader ' + req.params.leaderId )
});
module.exports = leadersRouter;