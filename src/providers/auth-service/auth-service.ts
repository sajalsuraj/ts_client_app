import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

let baseURL = "https://www.grabthetrendz.com/troubleshooter/";

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

  verifycustomerbyotp(data) {
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'get/verifycustomerbyotp',data)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  verifyotpuser(data){
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'get/verifyotpuser',data)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  updatepassword(data){
    return new Promise((resolve, reject) => {
      this.http.post(baseURL+'update/customerpassword',data)
        .subscribe(res => {
          resolve(res.json());
      }, (err) => {
          reject(err);
        });
    });
  }

  resendotp(data) {
    return new Promise((resolve, reject) => {
        this.http.post(baseURL+'add/resendotp',data)
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

}