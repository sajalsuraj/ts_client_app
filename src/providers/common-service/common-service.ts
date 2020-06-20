import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { HTTP } from '@ionic-native/http';
import {Platform} from 'ionic-angular';

let baseURL = "https://www.grabthetrendz.com/troubleshooter/";

@Injectable()
export class CommonService {

  constructor(public http: Http, public httpNative: HTTP, public platform: Platform) { }

  device_id: any;
  cartList = [];
  profession = '';
  subCategory = {
    "profession":"",
    "service_id": "",
    "lat":"",
    "lng": ""
  };

  createAuthorizationHeader(headers: Headers) {
    headers.append('access_token', localStorage.getItem('access_token'));
  }

  commonHeaders(headers: Headers){
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  }

  extractDateFromTimestamp(timestamp) {
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

  getUserDetails() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.get(baseURL + 'user/profiledata', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
 }

  getPackages() {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      // if(this.platform.is('android')){
      //   this.httpNative.get(baseURL + 'get/packages', {}, {}).then(res => {
      //     resolve(JSON.parse(res.data));
      //   });
      // }
      // else{
        this.http.get(baseURL + 'get/packages', { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      //}
    });
  }

  getAllServices() {
    return new Promise((resolve, reject) => {
      // if(this.platform.is('android')){
      //   this.httpNative.get(baseURL + 'get/services', {}, {}).then(res => {
      //     console.log(res.data);
      //     resolve(JSON.parse(res.data));
      //   });
      // }
      // else{
        this.http.get(baseURL + 'get/services')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      //}
      
    });
  }

  getServicesIncludingCategories() {
    return new Promise((resolve, reject) => {
      
        this.http.get(baseURL + 'get/allservices')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      
      
    });
  }

  getTwoServices() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/services2')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getHomePageData() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/homepage')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getAllBanners() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/banners')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getTerms() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/terms')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getHowItWorks() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/howitworks')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getContact() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/contact')
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getSubcategories(data) {
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'get/subcategories', data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  checkIfServicesBought(data){
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'get/checkIfServicesBought', data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  buyServices(data, type) {
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'add/'+type, data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getFaqs() {
    return new Promise((resolve, reject) => {
      this.http.get(baseURL + 'get/faq')
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
      this.http.post(baseURL + 'get/nearbyvendor', data, { headers: headers })
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
      this.http.post(baseURL + 'get/pendinguserbookings', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  bookingInfo(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'get/customerbookinginfo', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  bookingStatus(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'get/customerbookingstatus', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  addComment(data){
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'add/bookingcomment', data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  getComments(data){
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'get/bookingcomments', data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  vendorRating(data) {
    return new Promise((resolve, reject) => {
      this.http.post(baseURL + 'add/rating', data)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  completedBookings(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'get/completeduserbookings', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  bookingTimeline(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'get/bookingtimeline', data, { headers: headers })
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
      this.http.post(baseURL + 'get/vendorlocation', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  updateBooking(data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'update/customerbookingstatus', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

  updatePayment(data){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);
      this.http.post(baseURL + 'update/bookingpaymentupdate', data, { headers: headers })
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
      this.http.post(baseURL + '' + type + '/customerinfo', data, { headers: headers })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });
  }

}