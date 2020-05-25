import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { RequestsPage } from '../requests/requests';

@Component({
    selector: 'page-ratings',
    templateUrl: 'ratings.html'
})
export class RatingsPage {

    userData = {
        "name": ""
    }
    inputName: string;
    inputName1: string;
    inputName2: string;
    inputName3: string;
    note = "";

    serviceQuality: number = 0;
    speedOfWork: number = 0;
    priceSatisfaction: number = 0;
    serviceAttitude: number = 0;

    attitudeAllow = false;
    isRatingSelected = false;
    will_send = "0";
    will_send_flag = false;


    constructor(public commonService: CommonService, private tabs: Tabs, public alertCtrl: AlertController, private navCtrl: NavController, private navParams: NavParams) { }

    ionViewDidEnter() {
        this.userData.name = this.navParams.get('vendor_name');
        this.inputName = 'service1';
        this.inputName1 = 'service2';
        this.inputName2 = 'service3';
        this.inputName3 = 'service4';
    }

    onClick(type, rating: number): void {
        if (type === 'serviceQuality'){
            this.serviceQuality = rating;
        }
        else if(type === 'speedOfWork'){
            this.speedOfWork = rating;
        }    
        else if(type === 'priceSatisfaction'){
            this.priceSatisfaction = rating;
        }   
        else if(type === 'serviceAttitude'){
            this.serviceAttitude = rating;
            if(rating == 1){
                this.attitudeAllow = true;
            }
            else{
                this.attitudeAllow = false;
            }
        } 
        
        this.isRatingSelected = true;
    }

    sendFlagChanged(event, flag){
        if(flag){
            this.will_send = "0";
        }
        else{
            this.will_send = "1";
        }
    }

    showAlert(title,msg) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: [{
                'text': 'OK',
                'handler': data => {
                    this.navCtrl.setRoot(RequestsPage, {}, {animate: true, direction: 'forward'});
                }
            }]
        });
        alert.present();
    }

    submitRatings(){
        let fd = new FormData();
        fd.append('vendor_id', this.navParams.get('vendor_id'));
        fd.append('client_id', localStorage.getItem('user_id'));
        fd.append('service_quality', this.serviceQuality+'');
        fd.append('behaviour', this.serviceAttitude+'');
        fd.append('speed_of_work', this.speedOfWork+'');
        fd.append('price_satisfaction', this.priceSatisfaction+'');
        fd.append('will_send', this.will_send);
        fd.append('note', this.note);
        fd.append('booking_id', this.navParams.get('booking_id'));

        this.commonService.vendorRating(fd).then(res=>{
            this.showAlert("Success!", res['message']);
        });
    }

}