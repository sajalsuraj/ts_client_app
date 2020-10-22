import { Component } from '@angular/core';
import { NavController, App, LoadingController, AlertController, Alert} from 'ionic-angular';

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
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  userData = {
    "full_name": "",
    "phone": "",
    "email": "",
    "referral": "",
    "photo": ""
  }
  referAmount = "0";
  isFixedProfile = true;
  photo = "../assets/imgs/profile-pic.png";
  shouldHeight = document.body.clientHeight + 'px' ;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private camera: Camera, public loading: LoadingController, private socialSharing: SocialSharing, public appCtrl:App, public commonService: CommonService) {

  }

  selectImage(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.photo = base64Image;
   
      let loader = this.loading.create({
        spinner: 'bubbles',
        content: 'Updating image...',
      });

      loader.present().then(() => {
        let user_id = localStorage.getItem('user_id');
        let postData = new FormData();
        postData.append('user_id', user_id);
        postData.append('photo', this.photo);
        this.commonService.customerProfileInfo(postData, "update").then((result) => {
            if(result['status']){
              this.showAlert("Success", result['message']);
            }
            loader.dismiss();
            this.isFixedProfile = false;
          });
        }, (err) => {
        // Handle error
        loader.dismiss();
        });
    });
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
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
        if(this.userData['photo'] !== ""){
          this.photo = this.userData['photo'];
        }
        if(this.photo == "../assets/imgs/profile-pic.png"){
          this.isFixedProfile = true;
        }
        else{
          this.isFixedProfile = false;
        }
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
