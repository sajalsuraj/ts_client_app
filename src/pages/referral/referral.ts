import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-referral',
  templateUrl: 'referral.html'
})
export class ReferralPage {

    referralCode = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, private socialSharing: SocialSharing, public loading: LoadingController, public commonService:CommonService) {

    }

    ionViewDidLoad(){
        this.referralCode = this.navParams.get('referral');
    }

    shareWhatsapp(){
        let message = "Use my invite code "+this.referralCode+" to get a cash bonus of Rs. 100";
        this.socialSharing.shareViaWhatsApp(message, "", "").then(() => {
            // Sharing via email is possible
        }).catch(() => {
            // Sharing via email is not possible
        });
    }

    shareSocial(){
        let message = "Use my invite code "+this.referralCode+" to get a cash bonus of Rs. 100";
        this.socialSharing.share(message, "", "", "").then(() => {
            // Sharing via email is possible
        }).catch(() => {
            // Sharing via email is not possible
        });
    }
}