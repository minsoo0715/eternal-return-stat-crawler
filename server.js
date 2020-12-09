var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var service = require('./index')



var server = app.listen(4000, function(){
    console.log("Express Server has started on port 4000");
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', async (req,res) => {

    try{
        let data = await service(req.query.name, req.query.mode);
        res.send(data).end();
        return;

    }catch(e) {
        res.status(404).end();
    }
})