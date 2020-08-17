import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { AccountPage } from '../account/account';

@Component({
  selector: 'page-tnc',
  templateUrl: 'tnc.html'
})
export class TncPage {

  paragraph = "";
  error = false;
  constructor(public navCtrl: NavController, public loading: LoadingController, public commonService:CommonService) {

  }

  ionViewWillEnter(){
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting data...',
    });

    loader.present().then(() => {
      this.commonService.getTerms().then((result) => {
        if(result['status']){
          this.paragraph = result['paragraph'];
        }
        loader.dismiss();
        this.error = false;
      },
      error=>{
        loader.dismiss();
        this.error = true;
      });
    });
  }

  refreshData(){
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting data...',
    });

    loader.present().then(() => {
      this.commonService.getTerms().then((result) => {
        if(result['status']){
          this.paragraph = result['paragraph'];
        }
        loader.dismiss();
        this.error = false;
      },
      error=>{
        loader.dismiss();
        this.error = true;
      });
    });
  }

  goBack(){
    this.navCtrl.setRoot(AccountPage,{},{ animate: true, direction: 'back' });
  }

}
