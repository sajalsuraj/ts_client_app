import { Component, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonService } from '../../providers/common-service/common-service';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-trackbooking',
  templateUrl: 'track-booking.html'
})
export class TrackBookingPage {

    @ViewChild('map') mapRef: ElementRef;
    map: any;
    booking:object;
    address:string = "";
    checkDistance:any;
    vMarker:any;
    isCancelled = false;

    constructor(public commonService:CommonService, public platform:Platform, public alertCtrl: AlertController, private localNotifications: LocalNotifications, private callNumber: CallNumber, private navCtrl: NavController, private ngZone: NgZone, private navParams: NavParams, private ref: ChangeDetectorRef) {
    
    }

    ionViewDidLoad(){
        
        this.booking = this.navParams.get('booking_details');
        if(this.booking['booking_status'] === "4"){
            this.isCancelled = true;
        }
        this.booking['created_at'] = this.commonService.extractDateFromTimestamp(this.booking['created_at']);
        let geocoder = new google.maps.Geocoder;
        let latlng = {lat: parseFloat(this.booking['booking_lat']), lng: parseFloat(this.booking['booking_lng'])};
        this.showMap(latlng.lat, latlng.lng);
        geocoder.geocode({'location': latlng}, (results, status) => {
            if (results[0]) {
                this.address = results[0].formatted_address;
            }
        });
    }



    showMap(lat, lng){
        const location = new google.maps.LatLng(lat, lng);

        const options = {
            center: location,
            zoom: 15,
            zoomControl: false, mapTypeControl: false
        };

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);

        this.addMarker(location, this.map);
        if(this.booking['booking_status'] === "1"){
            let postData = new FormData();
            postData.append('user_id', this.booking['customer_id']);
            postData.append('booking_id', this.booking['booking_id']);
            this.checkDistance = setInterval(() => {
                
                this.commonService.getVendorLocation(postData).then((res)=>{
                    if(res['location']['distance'] < 10){
                        let vLocation = new google.maps.LatLng(parseFloat(res['location']['vendor_lat']), parseFloat(res['location']['vendor_lng']));
                        this.vendorMarker(vLocation, this.map);
                        this.platform.ready().then(() => {
                            this.localNotifications.schedule({
                                id: 1,
                                title: 'Troubleshooter',
                                text: this.booking['vendor_name']+' has reached your location'
                            });
                            
                            this.showAlert("Vendor reached!",this.booking['vendor_name']+' has reached your location');
                        });
                        clearInterval(this.checkDistance);
                    }
                    else{
                        let vLocation = new google.maps.LatLng(parseFloat(res['location']['vendor_lat']), parseFloat(res['location']['vendor_lng']));
                        this.vendorMarker(vLocation, this.map);
                    }
                });
            }, 5000);
        }
        
    }

    addMarker(position, map){
        return new google.maps.Marker({position, map});
    }

    vendorMarker(position, map){
        if (this.vMarker && this.vMarker.setMap) {
            this.vMarker.setMap(null);
        }
        this.vMarker = new google.maps.Marker({position, map});
        return this.vMarker;
    }

    callVendor(mob_num){
        this.callNumber.callNumber(mob_num, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    }

    cancelBooking(){
        let postData = new FormData();
            postData.append('user_id', this.booking['customer_id']);
            postData.append('booking_id', this.booking['booking_id']);
            postData.append('booking_status', "4");

            this.commonService.cancelBooking(postData).then((res)=>{
                if(res['status']){
                    this.isCancelled = true;
                    this.showAlert("Cancelled", res['message']);
                    this.booking['booking_status'] = "4";
                    let latlng = {lat: parseFloat(this.booking['booking_lat']), lng: parseFloat(this.booking['booking_lng'])};
                    this.showMap(latlng.lat, latlng.lng);
                    clearInterval(this.checkDistance);
                }
            });
    }

    showAlert(title,msg) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present();
    }
}