import { Component } from '@angular/core';

import { AccountPage } from '../account/account';
import { ServicesPage } from '../services/services';
import { RequestsPage } from '../requests/requests';
import { NotificationPage } from '../notification/notification';
import { EarningPage } from '../earnings/earnings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = RequestsPage;
  tab2Root = NotificationPage;
  tab4Root = AccountPage;
  tab5Root = ServicesPage;

  constructor() {

  }
}
