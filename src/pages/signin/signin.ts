import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { PasswordPage } from '../password/password';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth-service/auth-service';
import { FormBuilder, Validators, ValidatorFn, AbstractControl  }  from '@angular/forms';
import { CommonService } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  loginForm: any;
  logData = { phone:'', password:'' };
  tabBarElement: any;
  isPasswordViewed:boolean = false;
  passwordIcon = "eye-off";
  passwordType = "password";
  constructor(public navCtrl: NavController, public commonService:CommonService, public alertCtrl: AlertController, private _formBuilder: FormBuilder, public authService: AuthService) {
    this.loginForm = this._formBuilder.group({
      Phone: ["", Validators.required],
      Password: ["", Validators.required]
    });

    if(document.querySelector('.tabbar.show-tabbar')){
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
      this.tabBarElement.style.display = 'none';
    }
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
  

  ionViewWillEnter() {
    if(document.querySelector('.tabbar.show-tabbar')){
      this.tabBarElement.style.display = 'none';
    }
  }
 
  ionViewWillLeave() {
    if(document.querySelector('.tabbar.show-tabbar')){
      this.tabBarElement.style.display = 'flex';
    }
  }

  ionViewDidLoad(){
    if(document.querySelector('.tabbar.show-tabbar')){
      this.tabBarElement.style.display = 'none';
    }
    if(localStorage.getItem('access_token')){
      this.navCtrl.setRoot(TabsPage);
    }
  }

  doLogin(){
    let formData = new FormData();
    formData.append('phone', this.logData.phone);
    formData.append('password', this.logData.password);
    formData.append('device_id', this.commonService.device_id);
    this.authService.login(formData).then((result) => {
      if(result['status']){
        localStorage.setItem('access_token', result['access_token']);
        localStorage.setItem('user_id', result['user_id']);
        this.navCtrl.setRoot(TabsPage, {opentab: 5});
      }
      else{
        this.showAlert("Error", result['message']+". Please try again");
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
  
  tab(){
        this.navCtrl.setRoot(TabsPage);
	}
  password(){
        this.navCtrl.push(PasswordPage);
    }
  signup(){
        this.navCtrl.push(SignupPage);
    }
}
