import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, Platform  } from 'ionic-angular';
import { FormBuilder, Validators, ValidatorFn, AbstractControl  }  from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';
import { CommonService } from '../../providers/common-service/common-service';

import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html' 
})
export class SignupPage {

  registerForm: any;
  regData = { phone:'', password:'' }; 
  confirm_pass = "";
  isPasswordViewed:boolean = false;
  passwordIcon = "eye-off";
  passwordType = "password";

  isPassword2Viewed:boolean = false;
  passwordIcon2 = "eye-off";
  passwordType2 = "password";

  constructor(public navCtrl: NavController, private commonservice:CommonService, private platform:Platform, public alertCtrl: AlertController, private _formBuilder: FormBuilder, public authService: AuthService, private toastCtrl: ToastController) {
    this.registerForm = this._formBuilder.group({
      Phone: ["", Validators.required],
      Password: ["", Validators.required],
      confirm_pass: ["", [Validators.required, this.equalto('Password')]]
   });
  }

  passwordViewSwitch(){
    this.isPasswordViewed = !this.isPasswordViewed;
    if(this.isPasswordViewed){
      this.passwordIcon = "eye";
      this.passwordType = "text";
    }
    else{
      this.passwordIcon = "eye-off";
      this.passwordType = "password";
    }
  }

  confirmPasswordViewSwitch(){
    this.isPassword2Viewed = !this.isPassword2Viewed;
    if(this.isPassword2Viewed){
      this.passwordIcon2 = "eye";
      this.passwordType2 = "text";
    }
    else{
      this.passwordIcon2 = "eye-off";
      this.passwordType2 = "password";
    }
  }

  equalto(field_name): ValidatorFn {
      return (control: AbstractControl): { [key: string]: any } => {
          let input = control.value;
          let isValid = control.root.value[field_name] == input;
          if (!isValid)
              return {'equalTo': {isValid}};
          else
              return null;
      };
  }

  otp(){
        this.navCtrl.push(OtpPage)
  }
 
  doReg(){
    
    let formData = new FormData();
    formData.append('phone', this.regData.phone);
    formData.append('password', this.regData.password);
    formData.append('device_id', this.commonservice.device_id);
    this.authService.register(formData).then((result) => {
      if(result['status']){
        this.showAlert(result['message']);
        localStorage.setItem('phone', result['phone']);
        this.navCtrl.push(OtpPage);
      }
      else{
        this.showAlert(result['message']);
        this.registerForm = this._formBuilder.group({
          Phone: ["", Validators.required],
          Password: ["", Validators.required],
          confirm_pass: ["", [Validators.required, this.equalto('Password')]]
       });
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
