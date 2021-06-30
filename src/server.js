const express = require('express');
const bodyParser=require('body-parser');
const fs=require('fs');
const morgan=require('morgan');
const cors=require('cors');

//express app
const app=express();
const port=5000;


//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
})); 
app.use(morgan('dev'));
app.use(cors());

//default route for server
app.get('/', (req,res)=>res.status(200).send({
    message: "server is running"
}))



//Declare post/write route to accept incoming request with data
app.post('/write', async(req,res,next)=>{
    
    console.log("app.post called")
    const requestContent=JSON.stringify(req.body);
    fs.writeFile('./src/Models/employees.json', requestContent, (err)=>{
        console.log(contentToWrite);
        if(err){
            console.log(err);
        }
        else{
            console.log("Done writing to file");
        }
    })
    console.log("app.post worked");
})
//404 route
app.use('/', (req,res, next)=>res.status(404).send({
    message: "route not found"
}))

//run server
app.listen(port, ()=>{
    console.log(`server is running, listening on port ${port}`)
})