//Import express inside index.js file
const express = require('express')

//import dataservice
const dataService = require('./services/data.service')

//import cors
const cors = require('cors')

//import jsonwebtoken 
const jwt = require('jsonwebtoken')

//create server app using express
const app = express()

//to define origin using cors
app.use(cors({
    origin:'http://localhost:4200'
}))

//set up port for server app
app.listen(3000,()=>{
    console.log('Server started at 3000');
})

//Application specific Middleware
const appMiddleware = (req,res,next)=>{
    console.log('Application specific Middleware');
    next()
}

//to use in entire application
app.use(appMiddleware)

//to resolve client http request

// app.get('/',(req,res)=>{
//     res.send("GET REQUEST")
// })

// app.post('/',(req,res)=>{
//     res.send("POST REQUEST")
// })

// app.put('/',(req,res)=>{
//     res.send("PUT REQUEST")
// })

// app.patch('/',(req,res)=>{
//     res.send("PATCH REQUEST")
// })

// app.delete('/',(req,res)=>{
//     res.send("DELETE REQUEST")
// })

//to parse json
app.use(express.json())

//bank server api - request resolving

//jwt token verification middleware
const jwtMiddleware = (req,res,next)=>{

    console.log('Router specific Middleware');
    //1.get token from request header in access-token
    const token = req.headers['access-token']
    //2. verify token using verify method in jsonwebtoken
    try { 
    const data = jwt.verify(token,"secretkey12345")
    req.currentAcno =data.currentAcno
   
        next()
    }
    catch{
    res.status(422).json({
        status:false,
        message: 'please Log In'
        })
    }

}

//login API - resolve
app.post('/login',(req,res)=>{
    console.log(req.body);
    //asynchronous
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
})

//Register API - resolve
app.post('/register',(req,res)=>{
    console.log(req.body);
    //asynchronous
    dataService.register(req,req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
})

//Deposit API - resolve -Router specific Middleware
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    //asynchronous
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
})

//withdraw API - resolve -Router specific Middleware
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    //asynchronous
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
   
})