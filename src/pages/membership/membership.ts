import { Component } from "@angular/core";
import {
  NavController, App
} from "ionic-angular";
import { CommonService } from "../../providers/common-service/common-service";
import { TabsPage } from '../tabs/tabs';
import {SingleMembershipPage} from "../single-membership/single-membership";

@Component({
  selector: "page-membership",
  templateUrl: "membership.html"
})
export class MembershipPage {
  packageArr = [];
  planText = "";
  error = false;
  constructor(private commonService: CommonService, private navCtrl: NavController, private app: App) {}

  ionViewDidEnter() {
    this.commonService.getAllPackageMemberships().then(res => {
      if (res["status"]) {
        this.packageArr = res["data"];
      } else {
        this.packageArr = [];
      }
      this.error = false;
    },error=>{
      this.error = true;
    });
  }

  openMembership(item){
    this.navCtrl.push(SingleMembershipPage, {data:item});
  }

  refreshData(){
    this.commonService.getAllPackageMemberships().then(res => {
      if (res["status"]) {
        this.packageArr = res["data"];
      } else {
        this.packageArr = [];
      }
      this.error = false;
    },error=>{
      this.error = true;
    });
  }

  goBack(){
    this.app.getRootNav().setRoot(TabsPage);
  }
}
