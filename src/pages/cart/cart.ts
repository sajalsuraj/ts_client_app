import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { PaymentPage } from '../../pages/payment/payment';
import _ from 'underscore';

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html'
  })
export class CartPage {
    cartList = [];
    quantityObj = {};
    orderButtonData = {
        "totalAmount": 0,
        "totalOrders": 0
    };
    constructor(public navCtrl: NavController, public navParams: NavParams, public loading: LoadingController, public commonService:CommonService) {

    }
    ionViewDidEnter(){
        if(localStorage.getItem('ts_cart')){
            this.cartList = JSON.parse(localStorage.getItem('ts_cart'));
        }

        if(this.cartList.length > 0){
            let totalAmount = 0, totalOrders = 0;
            this.cartList.forEach(element => {
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
        this.commonService.profession = "";
        this.cartList.forEach(element => {
            this.quantityObj[element.id] = element.orderCount;
            this.commonService.profession += element.id + ",";
        });
        this.commonService.profession = this.commonService.profession.slice(0, -1);
        this.navCtrl.push(PaymentPage, {
            profession:this.commonService.profession,
            lat: this.commonService.subCategory.lat,
            lng: this.commonService.subCategory.lng,
            quantity: JSON.stringify(this.quantityObj)
        });
    }

    addQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount++;
        let itemIndex = _.findIndex(this.cartList, {"id":detail.id});
        this.cartList[itemIndex]['orderCount'] = detail.orderCount;
        this.updateCart(this.cartList);
        localStorage.setItem("ts_cart", JSON.stringify(this.cartList));
    }

    decreaseQuantity(detail, event){
        event.stopPropagation();
        detail.orderCount--;
        let itemIndex = _.findIndex(this.cartList, {"id":detail.id});
        if(detail.orderCount < 1){
            this.cartList.splice(itemIndex, 1);
        }
        else{
            this.cartList[itemIndex]['orderCount'] = detail.orderCount;
        }
        this.updateCart(this.cartList);
        localStorage.setItem("ts_cart", JSON.stringify(this.cartList));
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
}