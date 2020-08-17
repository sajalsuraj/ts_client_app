import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-categorydesc',
  templateUrl: 'categorydesc.html'
})

export class CategoryDescPage {

    subCategoryName = "";
    subcat = {};
    constructor(public navCtrl: NavController, public navParams:NavParams, public viewCtrl: ViewController){

    }

    ngOnInit(){
        this.subCategoryName = this.navParams.data.subcategoryname;
        this.subcat = this.navParams.data.subcat;
    }

    goBack(){
        this.viewCtrl.dismiss();
    }
}