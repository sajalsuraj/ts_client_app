import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { CallNumber } from '@ionic-native/call-number';
import { AccountPage } from '../account/account';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  phone = "";
  email = "";
  address = "";
  constructor(public navCtrl: NavController, private callNumber: CallNumber, public loading: LoadingController, public commonService:CommonService) {

  }

  ionViewWillEnter(){
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting data...',
    });

    loader.present().then(() => {
      this.commonService.getContact().then((result) => {
        if(result['status']){
          this.phone = result['details']['phone'];
          this.email = result['details']['email'];
          this.address = result['details']['address'];
        }
        loader.dismiss();
      },
      error=>{
        loader.dismiss();
      });
    });
  }

  callVendor(mob_num){
    this.callNumber.callNumber(mob_num, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  goBack(){
    this.navCtrl.setRoot(AccountPage,{},{ animate: true, direction: 'back' });
  }

}
