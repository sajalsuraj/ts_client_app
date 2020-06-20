import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-requestmessage',
  templateUrl: 'requestmessage.html'
})
export class RequestMessagePage {

    msg:string="";
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad(){
      this.msg = this.navParams.get('message');
  }

  goToHome(){
    this.navCtrl.push(TabsPage);
  }

}