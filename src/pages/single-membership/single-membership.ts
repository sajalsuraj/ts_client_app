import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import _ from 'underscore';
import { CommonService } from '../../providers/common-service/common-service';

/**
 * Generated class for the SingleMembershipPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-single-membership',
  templateUrl: 'single-membership.html',
})
export class SingleMembershipPage {

  membership:any;
  services = [];
  disabledBtnIfBought = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, private alert: AlertController, public commonService: CommonService) {
  }

  ionViewDidLoad() {
    this.membership = this.navParams.get('data');
    let serviceArr = JSON.parse(this.membership.services);
    serviceArr.forEach(element => {
      let idx = _.findIndex(this.membership.service_detail, {id:element.service});
      this.services.push({
        "name":this.membership.service_detail[idx].service_name,
        "detail":element
      });
    });
  }

  ionViewDidEnter(){
    this.membership = this.navParams.get('data');
    let data = new FormData();
    data.append('type',this.membership.type);
    data.append(this.membership.type+'_id', this.membership.id);
    data.append('user_id', localStorage.getItem('user_id'));
    this.commonService.checkIfServicesBought(data).then(res=>{
      if(res['status']){
        let toast = this.toast.create({message: res['message'],
        duration: 3000,
        position: 'bottom'});
        toast.present();
        this.disabledBtnIfBought = true;
      }
      else{
        this.disabledBtnIfBought = false;
      }
    });
  }

  buy(){ 
    let postData = new FormData();
    postData.append('user_id',localStorage.getItem('user_id'));
    postData.append(this.membership.type+'_id',this.membership.id);
    
    this.commonService.buyServices(postData, 'buy'+this.membership.type).then(res=>{
      if(!res['status'] && res['is_bought']){
        let alert = this.alert.create({
            title: 'Notification!',
            subTitle: res['message'],
            buttons: ['Ok']
        });
        alert.present();
      }
      else if(res['status'] && !res['is_bought']){
        let toast = this.toast.create({message: res['message'],
        duration: 3000,
        position: 'bottom'});
        toast.present();
        this.disabledBtnIfBought = true;
      }
      else{
        let toast = this.toast.create({message: res['message'],
        duration: 3000,
        position: 'bottom'});
        toast.present();
      }
    });
  }

}
