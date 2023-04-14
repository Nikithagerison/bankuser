//import db
const db = require('./db')

//import jsonwebtoken 
const jwt = require('jsonwebtoken')

//login defintion

const login = (acno,password)=>{

    //1.search acno,password in mongodb - findOne()
return db.User.findOne({
        acno,
        password
    }).then((result)=>{
        console.log(result);
        if(result){
            //generate token
            const token = jwt.sign({
                currentAcno:acno
            },"secretkey12345")

        //send to client    
            return{
                message:'Login Successfull',
                status:true,
                statusCode:200,
                username:result.username,
                token
            }
            
        }
        else{
            return{
                message:'Invalid Account Number / Password',
                status:false,
                statusCode:404
            }
        }
    })
}

//register
const register= (acno,pswd,uname)=>{

    //1. search acno in db if yes
    return db.User.findOne({
        acno
    }).then((result)=>{
    //2. if yes response: already exist
    if(result){
        return{
            message:'Already existing User!!',
            status:false,
            statusCode:404
        }
    }
    //3. new user: store all data into db
    else{
        let newUser = new db.User({
            acno,
            username:uname,
            password:pswd,
            balance:0,
            transaction:[]
        })
        newUser.save()
        return{
            message:'Register Successfully',
            status:true,
            statusCode:200
        }
    }
    })
  

}

//deposit defintion

const deposit = (req,acno,password,amount)=>{
    var amt = Number(amount)
    //1.search acno,password in mongodb - findOne()
return db.User.findOne({
        acno,
        password
    }).then((result)=>{
        if(acno!=req.currentAcno){
            return{
                message:'Permission Denied',
                status:false,
                statusCode:404
            }    
        }
        console.log(result);
        if(result){
            result.balance += amt
            result.transaction.push({
                amount,
                type:'CREDIT'
            })
            result.save()
            return{
                message:`${amount} deposited successfully and new balance is ${result.balance}`,
                status:true,
                statusCode:200,
                username:result.username
            }
            
        }
        else{
            return{
                message:'Invalid Account Number / Password',
                status:false,
                statusCode:404
            }
        }
    })
}

//withdraw defintion

const withdraw = (req,acno,password,amount)=>{
    var amt = Number(amount)
    //1.search acno,password in mongodb - findOne()
return db.User.findOne({
        acno,
        password
    }).then((result)=>{
        console.log(result);
        if(result){
            if(acno!=req.currentAcno){
                return{
                    message:'Permission Denied',
                    status:false,
                    statusCode:404
                }    
            }
            //check sufficient balance
            if(result.balance>amt){
            result.balance -= amt
            result.transaction.push({
                amount,
                type:'DEBIT'
            })
            result.save()
            return{
                message:`${amount} withdrawed successfully and new balance is ${result.balance}`,
                status:true,
                statusCode:200,
                username:result.username
            }
            
        }
        else{
            return{
                message:'Invalid Account Number / Password',
                status:false,
                statusCode:404
            }
        }
    
    }
    })
}


module.exports={
    login,
    register,
    deposit,
    withdraw
}
    
