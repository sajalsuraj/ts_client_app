import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CommonService } from '../../providers/common-service/common-service';
import { PaymentPage } from '../../pages/payment/payment';

import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-subcategorylist',
  templateUrl: 'subcategorylist.html'
})
export class SubcategorylistPage {
    subCategoryName = "";
    subCategoriesList = [];
    constructor(public navCtrl: NavController, public commonServices: CommonService, public alertCtrl: AlertController, public navParams: NavParams){}

    ionViewWillEnter(){
        this.subCategoryName = this.navParams.get('profession');
        let catData = new FormData();
        catData.append('id', this.navParams.get('service_id'));
        this.commonServices.getSubcategories(catData).then(res=>{
            if(res['status']){
                this.subCategoriesList = res['data'];
            }
        });
    }

    selectSubCategory(data, event){
        let catData = new FormData();
        catData.append('id', data.id);
        this.subCategoryName = data.service_name;
        this.commonServices.getSubcategories(catData).then(res=>{
            if(res['status']){
                this.subCategoriesList = res['data'];
            }
        });
    }

    selectService(detail, event){
        event.preventDefault();
        this.navCtrl.push(PaymentPage, {
            profession:this.navParams.get('profession'),
            lat: this.navParams.get('lat'),
            lng: this.navParams.get('lng')
        });
    }

}