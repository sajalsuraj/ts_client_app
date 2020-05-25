import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';
import { Keyboard } from '@ionic-native/keyboard';


import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html'
})
export class ChangepasswordPage {

  phone:any;
  keyBoardShow = false;
  shouldHeight = document.body.clientHeight + 'px' ;
  constructor(public navCtrl: NavController, private keyboard: Keyboard, public authService: AuthService) {

  }

  gotologin(){
    this.navCtrl.push(SigninPage);
  }

  ionViewWillEnter(){
    this.keyboard.onKeyboardShow().subscribe(res=>{
      this.keyBoardShow = true;
    });

    this.keyboard.onKeyboardHide().subscribe(res=>{
      this.keyBoardShow = false;
    });
  }

  verifycustomerbyotp(){
    if(this.phone == undefined || this.phone === ""){
      alert("Phone number cannot be empty");
    }
    else{
      if(this.phone.length > 10){
        alert("Phone number cannot be more than 10 digits");
        return;
      }

      if(this.phone.length < 10){
        alert("Phone number cannot be less than 10 digits");
        return;
      }
      let formData = new FormData();
      formData.append('phone', this.phone);
      this.authService.verifycustomerbyotp(formData).then((result)=>{
        if(result['status']){
          this.navCtrl.push(OtpPage, {
            "phone": this.phone,
            "page": "changepassword"
          });
        }
      });
    }
    
  }
  otp(){
      this.navCtrl.push(OtpPage)
  }

}
