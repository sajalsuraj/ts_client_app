import { Component } from '@angular/core';
import { NavController, AlertController, NavParams  } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';
import { NewpasswordPage } from '../newpassword/newpassword';

@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html'
})
export class OtpPage {

  constructor(public navCtrl: NavController, public navParams:NavParams, public authService: AuthService, public alertCtrl: AlertController) {

  }

  otpData = { phone:'', otp:'' }; 

  timer = 30;
  isTimerOn = true;

  ionViewDidEnter(){
    let downTime = setInterval(() => {
      this.timer--;
      if(this.timer < 1){
        this.isTimerOn = false;
        clearInterval(downTime);
      }
    }, 1000);
  }

  resendOTP(){
    let formData = new FormData();
    formData.append('phone', this.navParams.get('phone'));
    this.authService.resendotp(formData).then((result) => {
      if(result['status']){
        this.showAlert(result['message']);
        this.timer = 30;
        this.isTimerOn = true;
        let downTime = setInterval(() => {
          this.timer--;
          if(this.timer < 1){
            this.isTimerOn = false;
            clearInterval(downTime);
          }
        }, 1000);
      }
    }, (err) => {
      console.log(err);
      // this.loading.dismiss();
      // this.presentToast(err);
    });
  }
  
  signin(){
    let formData = new FormData();
    formData.append('phone', this.navParams.get('phone'));
    formData.append('otp', this.otpData.otp);
    formData.append('page', this.navParams.get('page'));
    if(this.navParams.get('page') === "signup"){
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
    else if(this.navParams.get('page') === "changepassword"){
      this.authService.verifyotpuser(formData).then((result) => {
        if(result['status']){
          this.showAlert(result['message']+", Please update your password");
          this.navCtrl.push(NewpasswordPage, {
            "phone": this.navParams.get('phone')
          });
        }
      }, (err) => {
        console.log(err);
        // this.loading.dismiss();
        // this.presentToast(err);
      });
    }
    
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
