import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';

import { ChangepasswordPage } from '../changepassword/changepassword';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public commonService: CommonService, public alertCtrl: AlertController) {

  }

  userData = {
    "name": "",
    "phone": "",
    "email": ""
  }

  ionViewDidLoad(){
   
  }
  ionViewWillEnter(){
    let user_id = localStorage.getItem('user_id');
    let postData = new FormData();
    postData.append('user_id', user_id);
    this.commonService.customerProfileInfo(postData, "get").then((result) => {
      this.userData = result['data'];
    });
  }
  
  changepassword(){
   this.navCtrl.push(ChangepasswordPage);
  }

  updateProfile(){
    let user_id = localStorage.getItem('user_id');
    let postData = new FormData();
    postData.append('user_id', user_id);
    postData.append('name', this.userData.name);
    postData.append('email', this.userData.email);
    postData.append('phone', this.userData.phone);
    this.commonService.customerProfileInfo(postData, "update").then((result) => {
      if(result['status']){
        this.showAlert("Success", result['message']);
      }
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

}
