import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage {

  constructor(public navCtrl: NavController, public authService: AuthService, public alertCtrl: AlertController) {

  }

  otpData = { phone:'', otp:'' }; 
  

  signin(){
    let formData = new FormData();
    formData.append('phone', localStorage.getItem('phone'));
    formData.append('otp', this.otpData.otp);
    this.authService.otp(formData).then((result) => {
      if(result['status']){
        this.showAlert(result['message']);
        this.navCtrl.setRoot(SigninPage);
      }
    }, (err) => {
      console.log(err);
      // this.loading.dismiss();
      // this.presentToast(err);
    });
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}
