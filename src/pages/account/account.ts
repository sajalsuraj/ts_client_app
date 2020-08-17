import { Component } from '@angular/core';
import { NavController, App, LoadingController} from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { ContactPage } from '../contact/contact';
import { TncPage } from '../tnc/tnc';
import { SigninPage } from '../signin/signin';
import {AboutPage} from '../about/about';
import {ReferralPage} from '../referral/referral';
import { CommonService } from '../../providers/common-service/common-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { PasswordPage } from '../password/password';
import { NotificationPage } from '../notification/notification';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  userData = {
    "full_name": "",
    "phone": "",
    "email": "",
    "referral": ""
  }
  referAmount = "0";
  shouldHeight = document.body.clientHeight + 'px' ;
  constructor(public navCtrl: NavController, public loading: LoadingController, private socialSharing: SocialSharing, public appCtrl:App, public commonService: CommonService) {

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
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting name & phone...',
    });

    loader.present().then(() => {
      let user_id = localStorage.getItem('user_id');
      let postData = new FormData();
      postData.append('user_id', user_id);
      this.commonService.customerProfileInfo(postData, "get").then((result) => {
        this.userData = result['data'];
        this.referAmount = result['refer_amount'];
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      });
    });
  }

  inviteFriends(){
    this.navCtrl.setRoot(ReferralPage, {referral: this.userData['referral'], refer_amount: this.referAmount}, {animate: true, direction: 'forward'});
  }
  
  profile(){
   this.navCtrl.setRoot(ProfilePage, {}, {animate: true, direction: 'forward'});
  }
   contact(){
   this.navCtrl.setRoot(ContactPage, {}, {animate: true, direction: 'forward'});
  }
  tnc(){
   this.navCtrl.setRoot(TncPage, {}, {animate: true, direction: 'forward'});
  }

  about(){
    this.navCtrl.setRoot(AboutPage, {}, {animate: true, direction: 'forward'});
  }

  faq(){
    this.navCtrl.setRoot(NotificationPage, {}, {animate: true, direction: 'forward'});
  }

  changePassword(){
    this.navCtrl.setRoot(PasswordPage, {phone: this.userData['phone']}, {animate: true, direction: 'forward'});
  }

  shareProp(){
    var message = "Troubleshooter Message";
    this.socialSharing.share(message, "", "", "").then(() => {
      // Sharing via email is possible
    }).catch(() => {
      // Sharing via email is not possible
    });
  }

  goBack(){
    this.appCtrl.getRootNav().setRoot(TabsPage);
  }
  
   logout(){
    localStorage.clear();
    this.appCtrl.getRootNav().setRoot(SigninPage);
  }

}
