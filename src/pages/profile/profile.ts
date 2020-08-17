import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { AccountPage } from '../account/account';

import { ChangepasswordPage } from '../changepassword/changepassword';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(public navCtrl: NavController, public loading: LoadingController, public commonService: CommonService, public alertCtrl: AlertController) {

  }

  userData = {
    "name": "",
    "address_1":"",
    "address_2": "",
    "city": "",
    "state": "",
    "pincode": ""
  }

  ionViewDidLoad(){
   
  }
  ionViewWillEnter(){
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting data...',
    });

    loader.present().then(() => {
      let user_id = localStorage.getItem('user_id');
      let postData = new FormData();
      postData.append('user_id', user_id);
      this.commonService.customerProfileInfo(postData, "get").then((result) => {
        this.userData = result['data'];
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      });
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
    postData.append('address_1', this.userData.address_1);
    postData.append('address_2', this.userData.address_2);
    postData.append('city', this.userData.city);
    postData.append('state', this.userData.state);
    postData.append('pincode', this.userData.pincode);
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

  goBack(){
    this.navCtrl.setRoot(AccountPage,{},{ animate: true, direction: 'back' });
  }

}
