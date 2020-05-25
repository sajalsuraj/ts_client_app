import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';

@Component({
  selector: 'page-subfaq',
  templateUrl: 'sub-faq.html'
})
export class SubFaqPage {

  faqTitles = [];
  faqTitle = "";
  faqLevel = 1;
  faqData = "";
  faqArr:any;
  constructor(public navCtrl: NavController, public commonService:CommonService, public navParams:NavParams) {

  }

  ionViewWillEnter(){
    this.faqTitles = [];
    this.faqLevel = 1;
    this.faqTitle = this.navParams.get('title_name');
    this.faqArr = JSON.parse(localStorage.getItem('faqArr'));
    if(this.faqArr){
        for(let i = 0; i < this.faqArr['faqList'].length; i++){
            if(this.faqArr['faqList'][i].faq_title == this.navParams.get('title_id')){
                this.faqTitles.push(this.faqArr['faqList'][i]);
            }
        }
    }
  }

  openFaq(title){
    this.faqLevel = 2;
    this.faqTitle = title.faq_category;
    this.faqData = title.faq_description;
  }

 

}