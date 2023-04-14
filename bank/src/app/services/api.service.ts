import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const options = {
  headers: new HttpHeaders()
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private api:HttpClient) { }

  //1. login API - asynchronous
  login(acno:any,pswd:any){
    const body={
      acno,
      pswd
    }
    return this.api.post('http://localhost:3000/login',body)
  }

  //2. register API - asynchronous
  register(acno:any,pswd:any,uname:any){
    const body={
      acno,
      pswd,
      uname
    }
    return this.api.post('http://localhost:3000/register',body)
  }

  //to insert token in a http header
  getToken(){
    //1.get token from local storage
    //if(localStorage.getItem("token")){
      const token = localStorage.getItem("token")
    
    //2. create http header
    let headers = new HttpHeaders()

    //3. to insert token inside header
    if(token){
      headers = headers.append("access-token",token)
      //to acheive function overloading
      options.headers = headers
    }
    return options
  }

  //3. register API - asynchronous
  deposit(acno:any,pswd:any,amount:any){
    const body={
      acno,
      pswd,
      amount
    }
    return this.api.post('http://localhost:3000/deposit',body,this.getToken())
  }
}
