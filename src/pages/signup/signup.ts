import { Component } from '@angular/core';
import { NavController, ToastController, AlertController, Platform  } from 'ionic-angular';
import { FormBuilder, Validators, ValidatorFn, AbstractControl  }  from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth-service';
import { SigninPage } from '../signin/signin';
import { CommonService } from '../../providers/common-service/common-service';
import { OtpPage } from '../otp/otp';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html' 
})
export class SignupPage {

  shouldHeight = document.body.clientHeight + 'px' ;
  registerForm: any;
  keyBoardShow = false;
  regData = { phone:'', password:'', referred_by:'' }; 
  confirm_pass = "";
  isPasswordViewed:boolean = false;
  passwordIcon = "eye-off";
  passwordType = "password";
  
  isPassword2Viewed:boolean = false;
  passwordIcon2 = "eye-off";
  passwordType2 = "password";

  constructor(public navCtrl: NavController, private keyboard: Keyboard, private commonservice:CommonService, private platform:Platform, public alertCtrl: AlertController, private _formBuilder: FormBuilder, public authService: AuthService, private toastCtrl: ToastController) {
    this.registerForm = this._formBuilder.group({
      Phone: ["", [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      Password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirm_pass: ["", [Validators.required, this.equalto('Password')]],
      referred_by: [""]
   });
  }

  ionViewDidLoad(){
    
  }

  ionViewWillEnter(){
    this.keyboard.onKeyboardShow().subscribe(res=>{
      this.keyBoardShow = true;
    });

    this.keyboard.onKeyboardHide().subscribe(res=>{
      this.keyBoardShow = false;
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

  gotologin(){
    this.navCtrl.push(SigninPage);
  }
 
  doReg(){
    let formData = new FormData();
    formData.append('phone', this.regData.phone);
    formData.append('referred_by', this.regData.referred_by);
    formData.append('password', this.regData.password);
    formData.append('device_id', this.commonservice.device_id);
    this.authService.register(formData).then((result) => {
      if(result['status']){
        this.showAlert(result['message']);
        this.navCtrl.push(OtpPage,{
          "phone": result['phone'],
          "page": "signup"
        });
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
