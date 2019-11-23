import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html'
})
export class ChangepasswordPage {

  constructor(public navCtrl: NavController) {

  }
  
   otp(){
        this.navCtrl.push(OtpPage)
  }

}
