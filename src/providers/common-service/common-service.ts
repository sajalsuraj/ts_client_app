import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

let baseURL = "http://www.grabthetrendz.com/troubleshooter/";

@Injectable()
export class CommonService { 

  constructor(public http: Http) {}  

  device_id:any;

  createAuthorizationHeader(headers: Headers) {
    headers.append('access_token', localStorage.getItem('access_token')); 
  }

  extractDateFromTimestamp(timestamp){
    var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh == 0) {
        h = 12;
    }

    // ie: 2014-03-24, 3:00 PM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
  }

  getUserDetails(){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);   
        this.http.get(baseURL+'user/profiledata', {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  getAllServices(){
    return new Promise((resolve, reject) => {
        this.http.get(baseURL+'get/services')
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  getNearbyVendor(data) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);  
        this.http.post(baseURL+'get/nearbyvendor', data, {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  pendingBookings(data) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);  
        this.http.post(baseURL+'get/pendinguserbookings', data, {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  getVendorLocation(data) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);  
        this.http.post(baseURL+'get/vendorlocation', data, {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  cancelBooking(data) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);  
        this.http.post(baseURL+'update/customerbookingstatus', data, {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

  customerProfileInfo(data, type) {
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);  
        this.http.post(baseURL+''+type+'/customerinfo', data, {headers:headers})
          .subscribe(res => {
            resolve(res.json());
        }, (err) => {
            reject(err);
          });
    });
  }

}