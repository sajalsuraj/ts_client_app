import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, App } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import {SubcategorylistPage} from '../subcategorylist/subcategorylist';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-services',
    templateUrl: 'services.html',
})

export class ServicesPage {
    serviceData = [];
    query: string = '';
    error = false;
    constructor(public navCtrl: NavController, private app: App, public zone: NgZone, public alertCtrl: AlertController, public navParams: NavParams, private commonService: CommonService, public platform: Platform) {

    }

    ionViewDidEnter() {
        this.commonService.getAllServices().then(res => {
            if (res['status']) {
                this.serviceData = res['data'];
            }
            this.error = false;
        },error=>{
            this.error = true;
        });
    }

    refreshData(){
        this.commonService.getAllServices().then(res => {
            if (res['status']) {
                this.serviceData = res['data'];
            }
            this.error = false;
        },error=>{
            this.error = true;
        });
    }

    selectService(service){
        this.navCtrl.push(SubcategorylistPage, {
            profession:service.service_name,
            service_id: service.id,
            image: service.image,
            page: "ServicesPage"
        });
    }

    goBack(){
        this.app.getRootNav().setRoot(TabsPage);
    }
}