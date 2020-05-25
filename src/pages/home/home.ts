import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, Slides, Tabs } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { MembershipPage } from '../membership/membership'
import { SubcategorylistPage } from '../subcategorylist/subcategorylist';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  serviceData = [];
  serviceList = [];
  autocompleteService: any;
  query: string = '';
  serviceText: string='';
  longitude: any;
  latitude: any;
  places = [];
  currLocation = "";
  coords1: Coordinates;
  watchLocationUpdates: any;
  bannerArr = [];
  searchText;
  upperContent = {
    "upper_content_heading": "",
    "upper_content_subheading": ""
  };
  lowerContent = "";
  @ViewChild(Slides) slides: Slides;



  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, private tabs: Tabs, public loading: LoadingController, private nativeGeocoder: NativeGeocoder, public zone: NgZone, public alertCtrl: AlertController, public navParams: NavParams, private commonService: CommonService, public platform: Platform, public geolocation: Geolocation) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
    this.commonService.getAllBanners().then(res => {
      if (res['status']) {
        this.bannerArr = res['banners'];
      }
    });

    this.commonService.getServicesIncludingCategories().then(res => {
      if (res['status']) {
        this.serviceList = res['data'];
      }
    });

    this.commonService.getTwoServices().then(res => {
      if (res['status']) {
        this.serviceData = res['data'];
      }
    });

    this.commonService.getHomePageData().then((res) => {
      this.upperContent.upper_content_heading = res['data'].upper_content_heading;
      this.upperContent.upper_content_subheading = res['data'].upper_content_subheading;
      this.lowerContent = res['data'].lower_content;
    });
    this.autocompleteService = new google.maps.places.AutocompleteService();

  }

  goToMembership() {
    this.tabs.select(2);
  }

  goToService() {
    this.tabs.select(3);
  }

  searchPlace() {
    let config = {
      types: ['geocode'],
      input: this.query,
      componentRestrictions: {
        country: 'in'
      }
    }
    if (this.query.length > 0) {
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

        this.places = [];
        if (predictions != null) {
          predictions.forEach((prediction) => {
            this.places.push(prediction);
          });
        }
      });
    } else {
      this.places = [];
    }
  }

  selectPlace(place) {
    this.places = [];
    this.geoCode(place.description);
    this.query = place.description;
  }

  selectServiceFromList(service){
    if (!this.latitude || !this.longitude) {
      this.showAlert("Alert!", "Please select the location");
    }
    else {
      this.navCtrl.setRoot(SubcategorylistPage, {
        profession: service.service_name,
        service_id: service.id,
        lat: this.latitude,
        lng: this.longitude,
        page: "HomePage"
      },{animate: true, direction: 'forward'});
    }
  }

  //convert Address string to lat and long
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.commonService.subCategory.lat = this.latitude;
      this.commonService.subCategory.lng = this.longitude;
    });
  }

  showAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {

     
      let optionsGeo: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      //use the geolocation 
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 }).then(data => {
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.commonService.subCategory.lat = this.latitude;
        this.commonService.subCategory.lng = this.longitude;
        this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude, optionsGeo)
            .then((result: NativeGeocoderReverseResult[]) => {
            
              this.query = result[0]['thoroughfare'] + ', ' + result[0]['subLocality'] + ', ' + result[0]['locality'] + ', ' + result[0]['administrativeArea'] + ', ' + result[0]['postalCode'];
            })
            .catch((error: any) => {
              //this.showAlert("Error!", "Not able to fetch the location, please enter manually or try again");
            
            });
      }).catch((err) => {

      });
    });
  }

  getCurrentLocation() {
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Fetching location',
    });

    loader.present().then(() => {
      this.platform.ready().then(() => {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };

        this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 }).then((res) => {
          this.latitude = res.coords.latitude;
          this.longitude = res.coords.longitude;
          this.commonService.subCategory.lat = this.latitude;
          this.commonService.subCategory.lng = this.longitude;
          this.nativeGeocoder.reverseGeocode(res.coords.latitude, res.coords.longitude, options)
            .then((result: NativeGeocoderReverseResult[]) => {
              loader.dismiss();
              this.query = result[0]['thoroughfare'] + ', ' + result[0]['subLocality'] + ', ' + result[0]['locality'] + ', ' + result[0]['administrativeArea'] + ', ' + result[0]['postalCode'];
            })
            .catch((error: any) => {
              this.showAlert("Error!", "Not able to fetch the location, please enter manually or try again");
              loader.dismiss();
            });
        }).catch((error) => {
          this.showAlert("Error!", "Not able to fetch the location, please enter manually or try again");
          loader.dismiss();
        });
      });
    });

  }

  selectService(service) {
    if (!this.latitude || !this.longitude) {
      this.showAlert("Alert!", "Please select the location");
    }
    else {
      this.navCtrl.push(SubcategorylistPage, {
        profession: service.service_name,
        service_id: service.id,
        lat: this.latitude,
        lng: this.longitude
      });
    }
  }

}
