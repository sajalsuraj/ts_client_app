import { Component } from '@angular/core';
import { NavController,AlertController, LoadingController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { SignupPage } from '../signup/signup';
import { AuthService } from '../../providers/auth-service/auth-service';
import { FormBuilder, Validators }  from '@angular/forms';
import { CommonService } from '../../providers/common-service/common-service';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {

  shouldHeight = document.body.clientHeight + 'px' ;
  loginForm: any;
  keyBoardShow = false;
  logData = { phone:'', password:'' };
  tabBarElement: any;
  isPasswordViewed:boolean = false;
  passwordIcon = "eye-off";
  passwordType = "password";
  constructor(public navCtrl: NavController, private keyboard: Keyboard, public loading: LoadingController, public commonService:CommonService, public alertCtrl: AlertController, private _formBuilder: FormBuilder, public authService: AuthService) {
    this.loginForm = this._formBuilder.group({
      Phone: ["", [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
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


    this.keyboard.onKeyboardShow().subscribe(res=>{
      this.keyBoardShow = true;
    });

    this.keyboard.onKeyboardHide().subscribe(res=>{
      this.keyBoardShow = false;
    });
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
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Signing in...',
    });

    loader.present().then(() => {
      let formData = new FormData();
      formData.append('phone', this.logData.phone);
      formData.append('password', this.logData.password);
      formData.append('device_id', this.commonService.device_id);
      this.authService.login(formData).then((result) => {
        loader.dismiss();
        if(result['status']){
          localStorage.setItem('access_token', result['access_token']);
          localStorage.setItem('user_id', result['user_id']);
          this.commonService.getFaqs().then((res)=>{
            localStorage.setItem('faqArr',JSON.stringify(res));
          });
          this.navCtrl.setRoot(TabsPage, {opentab: 5});
        }
        else{
          this.showAlert("Error", result['message']+". Please try again");
        }
      }, (err) => {
        loader.dismiss();
        this.showAlert("Error", "Server issue, please try after sometime");
        // this.loading.dismiss();
        // this.presentToast(err);
      });
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
  forgotpassword(){
        this.navCtrl.push(ChangepasswordPage);
    }
  signup(){
        this.navCtrl.push(SignupPage);
    }
}
