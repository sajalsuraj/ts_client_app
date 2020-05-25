import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { RatingsPage } from '../ratings/ratings';

@Component({
    selector: 'page-finalpayment',
    templateUrl: 'finalpayment.html'
  })
export class FinalPaymentPage {
    constructor(public navCtrl: NavController, private navParams: NavParams, public loading: LoadingController, public commonService:CommonService) {

    }
    serviceCharges = "";
    materialProcurementCharges = "";
    gst = "";
    finalBill = "";
    billWithMaterialCharge = "";
    ionViewDidEnter(){
      let fd = new FormData();
      fd.append('user_id', localStorage.getItem('user_id'));
      fd.append('booking_id', this.navParams.get('booking_id'));
      this.commonService.bookingInfo(fd).then(res=>{
        this.serviceCharges = res['info'][0]['service_charges'];
        this.materialProcurementCharges = res['info'][0]['material_procurement_charges'];
        this.gst = res['info'][0]['gst'];
        this.finalBill = res['info'][0]['finalBill'];
        this.billWithMaterialCharge = res['info'][0]['billWithMaterialCharge'];
      });
    }

    rateVendor(){
      let paymentData = new FormData();
      paymentData.append('user_id', localStorage.getItem('user_id'));
      paymentData.append('booking_id', this.navParams.get('booking_id'));
      this.commonService.updatePayment(paymentData).then(res => {
        this.navCtrl.setRoot(RatingsPage,{booking_id: this.navParams.get('booking_id'), vendor_id: this.navParams.get('vendor_id'), vendor_name: this.navParams.get('vendor_name')});
      });
      
    }
}