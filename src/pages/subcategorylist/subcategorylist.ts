import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, PopoverController} from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { CartPage } from '../../pages/cart/cart';
import { HomePage } from '../../pages/home/home';
import { CategoryDescPage } from '../../pages/categorydesc/categorydesc';
import { ServicesPage } from '../../pages/services/services';

import _ from 'underscore';

@Component({
  selector: 'page-subcategorylist',
  templateUrl: 'subcategorylist.html'
})
export class SubcategorylistPage {
    subCategoryName = "";
    profession = "";
    subCategoriesList = [];
    tempData = [];
    internalPageFlag = false;
    orderButtonData = {
        "totalAmount": 0,
        "totalOrders": 0
    };
    serviceImage = "";
    cartData = [];
    quantityObj = {};
    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public toastCtrl: ToastController, public commonServices: CommonService, public alertCtrl: AlertController, public navParams: NavParams){}
    ionViewDidLoad(){
        this.subCategoryName = this.navParams.get('profession');
        this.serviceImage = this.navParams.get('image');
        let catData = new FormData();
        catData.append('id', this.navParams.get('service_id'));
        this.commonServices.getSubcategories(catData).then(res=>{
            if(res['status']){
                this.subCategoriesList = res['data'];
                this.tempData = res['data'];
            }
        });
    }
    ionViewWillEnter(){
        if(localStorage.getItem('ts_cart')){
            this.cartData = JSON.parse(localStorage.getItem('ts_cart'));
        }
        this.updateCart(this.cartData);
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
                this.internalPageFlag = true;
                this.subCategoriesList = res['data'];
                this.subCategoriesList.forEach(element => {
                    element.orderCount = 0;
                    if(this.cartData.length){
                        this.cartData.forEach(val => {
                            if(val.id === element.id){
                                element.orderCount = val.orderCount;
                            }
                        });
                    }
                });
            }
            else{
                this.presentToast(res['message']);
            }
        });
    }

    selectService(detail, event){
        event.stopPropagation();
        let itemIndex = _.findIndex(this.cartData, {"id":detail.id});
        if(itemIndex == -1){
            detail.orderCount = 1;
            this.cartData.push(detail);
            this.updateCart(this.cartData);
        }
        else{
            detail.orderCount = parseInt(this.cartData[itemIndex]['orderCount']) + 1;
            this.cartData[itemIndex]['orderCount'] = detail.orderCount;
            this.updateCart(this.cartData);
        } 
        localStorage.setItem("ts_cart", JSON.stringify(this.cartData));
    }

    addQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount++;
        let itemIndex = _.findIndex(this.cartData, {"id":detail.id});
        this.cartData[itemIndex]['orderCount'] = detail.orderCount;
        this.updateCart(this.cartData);
        localStorage.setItem("ts_cart", JSON.stringify(this.cartData));
    }

    openDescription(subcat, event){
        event.stopPropagation();
        let data = {subcat:subcat, subcategoryname:this.subCategoryName}
        let popover = this.popoverCtrl.create(CategoryDescPage, data);
        popover.present();
    }

    decreaseQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount--;
        let itemIndex = _.findIndex(this.cartData, {"id":detail.id});
        if(detail.orderCount < 1){
            this.cartData.splice(itemIndex, 1);
        }
        else{
            this.cartData[itemIndex]['orderCount'] = detail.orderCount;
        }
        this.updateCart(this.cartData);
        localStorage.setItem("ts_cart", JSON.stringify(this.cartData));
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
        this.commonServices.profession = "";
        this.cartData.forEach(element => {
            this.quantityObj[element.id] = element.orderCount;
            this.commonServices.profession += element.id + ",";
        });
        console.log(this.commonServices.profession);
        this.commonServices.profession = this.commonServices.profession.slice(0, -1);
        
        this.navCtrl.push(CartPage, {
            profession:this.commonServices.profession,
            lat: this.commonServices.subCategory.lat,
            lng: this.commonServices.subCategory.lng,
            quantity: JSON.stringify(this.quantityObj)
        });
    }

    goBack(){
        if(!this.internalPageFlag){
            if(this.navParams.get('page') == "HomePage"){
                this.navCtrl.setRoot(HomePage,{},{ animate: true, direction: 'back' });
            }
            else if(this.navParams.get('page') == "ServicesPage"){
                this.navCtrl.setRoot(ServicesPage,{},{ animate: true, direction: 'back' });
            }
        }
        else{
            this.subCategoriesList = this.tempData;
            this.internalPageFlag = false;
        }
    }
}