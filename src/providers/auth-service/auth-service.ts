import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

let baseURL = "http://www.grabthetrendz.com/troubleshooter/";

@Injectable()
export class AuthService { 

  constructor(public http: Http) {}  
  
  register(regData) {
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'add/customersignup', regData)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  login(data) {
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'get/customerlogin', data)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  otp(data){
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'get/verifyotpcustomer', data)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

}