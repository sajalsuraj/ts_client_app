import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { AccountPage } from '../account/account';
import {SubFaqPage} from '../../pages/sub-faq/sub-faq';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  faqTitles = [];
  faqArr:any;
  query: string = '';
  constructor(public navCtrl: NavController, public commonService:CommonService) {

  }

  ionViewWillEnter(){
    this.faqArr = JSON.parse(localStorage.getItem('faqArr'));
    if(this.faqArr){
      this.faqTitles = this.faqArr['titles'];
    }
  }

  openFaq(title){
    this.navCtrl.push(SubFaqPage,{title_id: title.id, title_name:title.title});
  }

  goBack(){
    this.navCtrl.setRoot(AccountPage,{},{ animate: true, direction: 'back' });
  }

}