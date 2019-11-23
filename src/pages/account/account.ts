import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { ContactPage } from '../contact/contact';
import { TncPage } from '../tnc/tnc';
import { SigninPage } from '../signin/signin';
import { CommonService } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  userData = {
    "full_name": "",
    "phone": "",
    "email": ""
  }
  constructor(public navCtrl: NavController, public commonService: CommonService) {

  }
  ionViewDidLoad(){
    // if(!localStorage.getItem('name')){
    //   this.commonService.getUserDetails().then(result => {
    //     if(result['status']){
    //       localStorage.setItem('name', result['data']['full_name']);
    //       localStorage.setItem('phone', result['data']["phone"]);
    //       localStorage.setItem('email', result['data']['email'])
    //       this.userData = {
    //         "full_name": result['data']['full_name'],
    //         "phone": result['data']["phone"],
    //         "email": result['data']['email']
    //       }
    //     }
    //   });
    // }
    // else{
    //   this.userData = {
    //     "full_name": localStorage.getItem('name'),
    //     "phone": localStorage.getItem('phone'),
    //     "email": localStorage.getItem('email')
    //   }
    // }
    // this.userData = {
    //   "full_name": "Sajal Suraj",
    //   "phone": "8210907970",
    //   "email": ""
    // }
  }

  ionViewWillEnter(){
    let user_id = localStorage.getItem('user_id');
    let postData = new FormData();
    postData.append('user_id', user_id);
    this.commonService.customerProfileInfo(postData, "get").then((result) => {
      this.userData = result['data'];
    });
  }
  
  profile(){
   this.navCtrl.push(ProfilePage);
  }
   contact(){
   this.navCtrl.push(ContactPage);
  }
  tnc(){
   this.navCtrl.push(TncPage);
  }
   logout(){
    localStorage.clear();
    this.navCtrl.setRoot(SigninPage);
  }

}
