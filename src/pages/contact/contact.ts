import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  phone = "";
  email = "";
  constructor(public navCtrl: NavController, public loading: LoadingController, public commonService:CommonService) {

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
          this.phone = result['details']['email'];
        }
        loader.dismiss();
      },
      error=>{
        loader.dismiss();
      });
    });
  }

}
