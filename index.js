const express=require('express');
const mongoose  = require('mongoose');
const app=express();
const port=3000;
const Router=require('./routes/Router');


app.use(express.json())
app.use('/',Router.Router)

mongoose.connect('mongodb://localhost/task')
.then(()=>{console.log('connected to mongodb...')})
.catch(()=>{console.log('not connected')})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
