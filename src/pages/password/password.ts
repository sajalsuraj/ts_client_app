import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {

  constructor(public navCtrl: NavController) {

  }
  
   otp(){
        this.navCtrl.push(OtpPage)
  }

}
