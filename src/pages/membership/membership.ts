import { Component } from "@angular/core";
import {
  NavController
} from "ionic-angular";
import { CommonService } from "../../providers/common-service/common-service";

import {SingleMembershipPage} from "../single-membership/single-membership";

@Component({
  selector: "page-membership",
  templateUrl: "membership.html"
})
export class MembershipPage {
  packageArr = [];
  planText = "";
  constructor(private commonService: CommonService, private navCtrl: NavController) {}

  ionViewDidEnter() {
    this.commonService.getPackages().then(res => {
      if (res["status"]) {
        this.packageArr = res["data"];
      } else {
        this.packageArr = [];
      }
    });
  }

  openMembership(item){
    this.navCtrl.push(SingleMembershipPage, {data:item});
  }
}
