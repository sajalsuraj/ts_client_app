import { Component, ViewChild } from '@angular/core';
import {Tabs} from 'ionic-angular';
import { AccountPage } from '../account/account';
import { RequestsPage } from '../requests/requests';
import { NotificationPage } from '../notification/notification';
import { EarningPage } from '../earnings/earnings';
import { HomePage } from '../home/home';
import { ServicesPage } from '../services/services';
import { MembershipPage } from '../membership/membership';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RequestsPage;
  tab2Root = CartPage;
  tab4Root = AccountPage;
  tab5Root = HomePage;
  tab3Root = ServicesPage;
  tab6Root = MembershipPage;

  @ViewChild('myTabs') tabRef: Tabs;

  constructor() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tabRef.select(0);
      }, 500);
    }
}
