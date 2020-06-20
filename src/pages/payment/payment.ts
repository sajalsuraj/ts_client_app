import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { RequestMessagePage } from '../requestmessage/requestmessage';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  reqSent = true;
    
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public commonService:CommonService, public navParams: NavParams) {

  }

  payment(){
    this.reqSent = false;
    let formData = new FormData();

    formData.append('lat', this.navParams.get('lat'));
    formData.append('lng', this.navParams.get('lng'));
    formData.append('quantity', this.navParams.get('quantity'));
    formData.append('profession', this.navParams.get('profession'));
    formData.append('user_id', localStorage.getItem('user_id'));
    this.commonService.profession = "";
    localStorage.setItem('ts_cart', JSON.stringify([]));
    this.commonService.getNearbyVendor(formData).then((result) => {
      if(result['status']){
        this.reqSent = true;
        this.navCtrl.push(RequestMessagePage, {message: result['message']});
      }
      else{
        this.reqSent = true;
        this.showAlert("Sorry!", result['message']);
      }
    }, (err) => {
      console.log(err);
      // this.loading.dismiss();
      // this.presentToast(err);
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
    this.navCtrl.pop();
  }

}