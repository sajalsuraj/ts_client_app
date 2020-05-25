import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import {SubcategorylistPage} from '../subcategorylist/subcategorylist';

@Component({
    selector: 'page-services',
    templateUrl: 'services.html',
})

export class ServicesPage {
    serviceData = [];
    query: string = '';
    constructor(public navCtrl: NavController, public zone: NgZone, public alertCtrl: AlertController, public navParams: NavParams, private commonService: CommonService, public platform: Platform) {

    }

    ionViewDidEnter() {
        this.commonService.getAllServices().then(res => {
            if (res['status']) {
                this.serviceData = res['data'];
            }
        });
    }

    selectService(service){
        this.navCtrl.setRoot(SubcategorylistPage, {
            profession:service.service_name,
            service_id: service.id,
            page: "ServicesPage"
        });
    }
}