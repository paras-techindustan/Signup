const config=require('config')
const express=require('express');
const mongoose  = require('mongoose');
const app=express();
const port=3000;
const Router=require('./routes/Router');


app.use(express.json())
app.use('/',Router.Router)


if(!config.get("jwtPrivateKey")){
    console.error('FATAL ERROR : jwtPrivateKey is not defined');
    process.exit(1);
}


mongoose.connect('mongodb://localhost/task')
.then(()=>{console.log('connected to mongodb...')})
.catch(()=>{console.log('not connected')})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})
