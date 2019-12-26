import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Slides } from 'ionic-angular';
import { CommonService } from '../../providers/common-service/common-service';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import {SubcategorylistPage} from '../../pages/subcategorylist/subcategorylist';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {

  serviceData = [];
  autocompleteService: any;
  query: string = '';
  longitude:any;
  latitude:any;
  places = [];
  currLocation = "";
  coords1:Coordinates;
  watchLocationUpdates:any; 
  bannerArr = [];
  @ViewChild(Slides) slides: Slides;



  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, private nativeGeocoder: NativeGeocoder, public zone: NgZone, public alertCtrl: AlertController, public navParams: NavParams, private commonService:CommonService, public platform: Platform, public geolocation: Geolocation) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
    this.commonService.getAllBanners().then(res=>{
      if(res['status']){
        this.bannerArr = res['banners'];
      }
    });
    this.commonService.getAllServices().then(res => {
      if(res['status']){
        this.serviceData = res['data'];
      }
    });
    this.autocompleteService = new google.maps.places.AutocompleteService();

  }

  searchPlace(){
    let config = {
      types: ['geocode'],
      input: this.query,
      country: ['in']
    }
    if(this.query.length > 0){
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

        this.places = [];

        predictions.forEach((prediction) => {
            this.places.push(prediction);
        });
          

      });
    }else {
      this.places = [];
    }
  }

  selectPlace(place){
    this.places = [];
    this.geoCode(place.description);
    this.query = place.description;
  }

  //convert Address string to lat and long
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
    this.latitude = results[0].geometry.location.lat();
    this.longitude = results[0].geometry.location.lng();
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

  ionViewDidEnter(){
    
  }

  getCurrentLocation(){
   
    this.platform.ready().then(()=>{
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      
      this.geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 3000}).then((res) => {
        this.nativeGeocoder.reverseGeocode(res.coords.latitude, res.coords.longitude, options)
        .then((result: NativeGeocoderReverseResult[]) => {})
        .catch((error: any) => {});
      }).catch((error) => {
        this.showAlert("Error!","Not able to fetcht the location, please enter manually");
      });
    
    });
    
  }

  selectService(service){
    if(!this.latitude || !this.longitude){
      this.showAlert("Alert!","Please select the location");
    }
    else{
      this.navCtrl.push(SubcategorylistPage, {
        profession:service.service_name,
        service_id: service.id,
        lat: this.latitude,
        lng: this.longitude
      });
    }
  }

}
