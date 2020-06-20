import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FaqDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-faq-detail',
  templateUrl: 'faq-detail.html',
})
export class FaqDetailPage {

  faqTitle = "";
  faqData = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqDetailPage');
    let data = this.navParams.get('data');
    this.faqTitle = data.faq_category;
    this.faqData = data.faq_description;
  }

}
