import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';

import {SubFaqPage} from '../../pages/sub-faq/sub-faq';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  faqTitles = [];
  constructor(public navCtrl: NavController, public commonService:CommonService) {

  }

  ionViewWillEnter(){
    if(this.commonService.faqArr){
      this.faqTitles = this.commonService.faqArr['titles'];
    }
  }

  openFaq(title){
    this.navCtrl.push(SubFaqPage,{title_id: title.id, title_name:title.title});
  }

}