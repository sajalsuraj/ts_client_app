import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { CommonService } from '../../providers/common-service/common-service';
import { PaymentPage } from '../../pages/payment/payment';
import _ from 'underscore';

import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-subcategorylist',
  templateUrl: 'subcategorylist.html'
})
export class SubcategorylistPage {
    subCategoryName = "";
    subCategoriesList = [];
    orderButtonData = {
        "totalAmount": 0,
        "totalOrders": 0
    };
    constructor(public navCtrl: NavController, public toastCtrl: ToastController, public commonServices: CommonService, public alertCtrl: AlertController, public navParams: NavParams){}
    ionViewDidLoad(){
        this.subCategoryName = this.navParams.get('profession');
        let catData = new FormData();
        catData.append('id', this.navParams.get('service_id'));
        this.commonServices.getSubcategories(catData).then(res=>{
            if(res['status']){
                this.subCategoriesList = res['data'];
            }
        });
    }
    ionViewWillEnter(){
        this.updateCart(this.commonServices.cartList);
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position: 'bottom',
          dismissOnPageChange: true
        });
    
        toast.onDidDismiss(() => {
          
        });
    
        toast.present();
      }

    selectSubCategory(data, event){
        let catData = new FormData();
        catData.append('id', data.id);
        this.subCategoryName = data.service_name;
        this.commonServices.getSubcategories(catData).then(res=>{
            if(res['status']){
                this.subCategoriesList = res['data'];
                this.subCategoriesList.forEach(element => {
                    element.orderCount = 0;
                });
            }
            else{
                this.presentToast(res['message']);
            }
        });
    }

    selectService(detail, event){
        event.stopPropagation();
        detail.orderCount = 1;
        this.commonServices.cartList.push(detail);
        this.updateCart(this.commonServices.cartList);
    }

    addQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount++;
        let itemIndex = _.findIndex(this.commonServices.cartList, {"id":detail.id});
        this.commonServices.cartList[itemIndex]['orderCount'] = detail.orderCount;
        this.updateCart(this.commonServices.cartList);
    }

    decreaseQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount--;
        let itemIndex = _.findIndex(this.commonServices.cartList, {"id":detail.id});
        if(detail.orderCount < 1){
            this.commonServices.cartList.splice(itemIndex, 1);
        }
        else{
            this.commonServices.cartList[itemIndex]['orderCount'] = detail.orderCount;
        }
        this.updateCart(this.commonServices.cartList);
    }

    updateCart(cart){
        if(cart.length > 0){
            let totalAmount = 0, totalOrders = 0;
            cart.forEach(element => {
                totalAmount += (parseInt(element.rate_per_min) * element.orderCount);
                totalOrders += parseInt(element.orderCount);
            });
            this.orderButtonData = {
                "totalAmount": totalAmount,
                "totalOrders": totalOrders
            };
        }
    }

    goToPaymentPage(){
        this.navCtrl.push(PaymentPage, {
            profession:this.navParams.get('profession'),
            lat: this.navParams.get('lat'),
            lng: this.navParams.get('lng')
        });
    }
}