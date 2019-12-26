import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  paragraph = "";
  constructor(public navCtrl: NavController, public loading: LoadingController, public commonService:CommonService) {

  }

  ionViewWillEnter(){
    let loader = this.loading.create({
        spinner: 'bubbles',
        content: 'Getting data...',
    });

    loader.present().then(() => {
        this.commonService.getHowItWorks().then((result) => {
            if(result['status']){
                this.paragraph = result['paragraph'];
            }
            loader.dismiss();
        },
        error=>{
          loader.dismiss();
        });
    });
  }

}
