import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-referral',
  templateUrl: 'referral.html'
})
export class ReferralPage {

    constructor(public navCtrl: NavController, private socialSharing: SocialSharing, public loading: LoadingController, public commonService:CommonService) {

    }

    shareWhatsapp(){
        let message = "Use my invite code 4XTU8W to get a cash bonus of Rs. 100";
        this.socialSharing.shareViaWhatsApp(message, "", "").then(() => {
            // Sharing via email is possible
        }).catch(() => {
            // Sharing via email is not possible
        });
    }

    shareSocial(){
        let message = "Use my invite code 4XTU8W to get a cash bonus of Rs. 100";
        this.socialSharing.share(message, "", "", "").then(() => {
            // Sharing via email is possible
        }).catch(() => {
            // Sharing via email is not possible
        });
    }
}