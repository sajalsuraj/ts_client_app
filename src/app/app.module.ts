import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { CommonService } from '../providers/common-service/common-service';
import { AuthService } from '../providers/auth-service/auth-service';

import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { AccountPage } from '../pages/account/account';
import { OtpPage } from '../pages/otp/otp';
import { ProfilePage } from '../pages/profile/profile';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ServicesPage } from '../pages/services/services';
import { TncPage } from '../pages/tnc/tnc';
import { PasswordPage } from '../pages/password/password';
import { PaymentPage } from '../pages/payment/payment';
import { RequestMessagePage } from '../pages/requestmessage/requestmessage';
import { RequestsPage } from '../pages/requests/requests';
import { NotificationPage } from '../pages/notification/notification';
import { TrackBookingPage } from '../pages/track-booking/track-booking';
import {EarningPage} from '../pages/earnings/earnings';

import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../providers/google-map-service/google-map-service';
import { NativeGeocoder} from '@ionic-native/native-geocoder';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { FCM } from '@ionic-native/fcm';
import { Push } from '@ionic-native/push';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    ContactPage,
    AccountPage,
    OtpPage,
    ProfilePage,
    SigninPage,
    SignupPage,
    ServicesPage,
    TncPage,
    PasswordPage,
    PaymentPage,
    RequestMessagePage,
    RequestsPage,
    TrackBookingPage,
    NotificationPage,
    EarningPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    ContactPage, 
    AccountPage,
    OtpPage,
    ProfilePage,
    SigninPage,
    SignupPage,
    ServicesPage,
    TncPage,
    PasswordPage,
    PaymentPage,
    RequestMessagePage,
    RequestsPage,
    TrackBookingPage,
    NotificationPage,
    EarningPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonService,
    Geolocation,
    GoogleMaps,
    AuthService,
    FCM,
    Push,
    CallNumber,
    LocalNotifications,
    NativeGeocoder,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
