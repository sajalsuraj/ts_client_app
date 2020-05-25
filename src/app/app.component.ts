import { Component, Injectable } from '@angular/core';
import { Platform, AlertController, NavController, App, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SigninPage } from '../pages/signin/signin';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CommonService } from '../providers/common-service/common-service';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { SplashPage } from '../pages/splash/splash';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;
  alertButtons = [];

  private navCtrl: NavController;

  constructor(platform: Platform, modalCtrl: ModalController, private app:App, private androidPermissions:AndroidPermissions, private commonservice:CommonService, public alertCtrl: AlertController, private push: Push, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.navCtrl = app.getActiveNav();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // splashScreen.hide();
      androidPermissions.requestPermissions([
        androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
      ]);
      this.pushSetup();

      statusBar.backgroundColorByHexString('#6954e1');
      statusBar.styleLightContent();

      let splash = modalCtrl.create(SplashPage);
      splash.present();
    });
  }


  pushSetup(){
    
    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID:'283669128616'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);


    pushObject.on('notification').subscribe((notification: any) => {
      if(notification.additionalData.foreground){
        if(notification.additionalData.action === "request_accepted"){
          this.alertButtons = [
            {
              text: 'OK',
              handler: () => {
                //this.showSimpleAlert("Coming", "Debug more");
                //this.navCtrl.push(RequestsPage);
              }
            }
          ];
          this.showAlert("Request Accepted", notification.message+". Go to your request tab", this.alertButtons);
        }
        
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {this.commonservice.device_id = registration.registrationId; });//console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  showSimpleAlert(title, msg){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  showAlert(title, msg, buttons) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: buttons,
      enableBackdropDismiss: true
    });
    alert.present();
  }
}
