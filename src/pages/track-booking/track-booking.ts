import { Component, ViewChild, ElementRef} from '@angular/core';
import { CommonService } from '../../providers/common-service/common-service';
import { NavController, NavParams, Platform, AlertController} from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FinalPaymentPage } from '../finalpayment/finalpayment';
import { RequestsPage } from '../requests/requests';

@Component({
    selector: 'page-trackbooking',
    templateUrl: 'track-booking.html'
})
export class TrackBookingPage {

    @ViewChild('map') mapRef: ElementRef;
    map: any;
    booking: object;
    address: string = "";
    checkDistance: any;
    vMarker: any;
    isCancelled = false;
    hasStarted = false;
    hasCompleted = false;
    isPaused = false;
    hasResumed = false;
    requestedAt = "";
    acceptedAt = "";
    reachedLocationAt = "";
    jobStartedAt = "";
    jobCompletedAt = "";
    jobPausedAt = "";
    jobRestartedAt = "";
    hasPaid = false;
    checkBookingStatus:any;
    comment = "";
    commentsArr = [];
    hasFinallyCompleted = false;
    hasReachedLocation = false;
    timelineArr = [];

    constructor(public commonService: CommonService, public platform: Platform, public alertCtrl: AlertController, private localNotifications: LocalNotifications, private callNumber: CallNumber, private navCtrl: NavController, private navParams: NavParams) {

    }

    ionViewDidLoad() {

        this.booking = this.navParams.get('booking_details');
        if (this.booking['booking_status'] === "4") {
            this.isCancelled = true;
            this.hasCompleted = true;
            this.hasStarted = true;
            this.isPaused = true;
            this.hasPaid = true;
        }
        else if (this.booking['booking_status'] === "5") {
            this.hasCompleted = true;
            this.hasStarted = true;
            this.isPaused = true;
            this.isCancelled = true;
            this.hasFinallyCompleted = true;
            this.hasResumed = true;
        }
        else if (this.booking['booking_status'] === "2") {
            this.hasStarted = true;
            this.isCancelled = true;
            this.hasResumed = true;
        }
        else if (this.booking['booking_status'] === "3") {
            this.isPaused = true;
            this.hasStarted = true;
            this.isCancelled = true;
            this.hasResumed = false;
        }
        else if (this.booking['booking_status'] === "1") {
            this.isCancelled = false;
            this.hasCompleted = true;
            this.hasStarted = true;
            this.isPaused = true;
            this.hasResumed = true;
        }
        else if (this.booking['booking_status'] === "6") {
            this.hasStarted = true;
            this.isPaused = false;
            this.isCancelled = true;
            this.hasResumed = true;
        }

        if (this.booking['has_paid'] == "1") {
            this.hasPaid = true;
        }

        if(this.booking['is_otp_verified'] == "0"){
            this.hasStarted = false;
        }

        this.booking['created_at'] = this.commonService.extractDateFromTimestamp(this.booking['created_at']);
        let geocoder = new google.maps.Geocoder;
        let latlng = { lat: parseFloat(this.booking['booking_lat']), lng: parseFloat(this.booking['booking_lng']) };
        this.showMap(latlng.lat, latlng.lng);
        geocoder.geocode({ 'location': latlng }, (results, status) => {
            if (results[0]) {
                this.address = results[0].formatted_address;
            }
        });

    }

    ionViewWillLeave(){
        clearInterval(this.checkBookingStatus);
    }

    addComment(){
        let commentData = new FormData();
        commentData.append('booking_id', this.booking['booking_id']);
        commentData.append('comment', this.comment);
        this.commonService.addComment(commentData).then(res=>{
            this.comment = "";
            this.getBookingTimeline();
        });
    }

    getBookingStatus() {
        if (this.booking) {
            let fd = new FormData();
            fd.append('user_id', localStorage.getItem('user_id'));
            fd.append('booking_id', this.booking['booking_id']);
            this.commonService.bookingStatus(fd).then(res => {
                if(res['info'][0]['is_otp_verified'] == "0"){
                    this.hasStarted = false;
                }
                else if(res['info'][0]['is_otp_verified'] == "1"){
                    this.hasStarted = true;
                }

                if(res['info'][0]['booking_status'] === "4"){
                    this.isCancelled = true;
                    this.hasCompleted = true;
                    this.hasStarted = true;
                    this.isPaused = true;
                    this.hasFinallyCompleted = true;
                    this.hasPaid = true;
                }
                else if(res['info'][0]['booking_status'] === "5"){
                    this.hasCompleted = true;
                    this.hasStarted = true;
                    this.isPaused = true;
                    this.isCancelled = true;
                    this.hasResumed = true;
                    clearInterval(this.checkBookingStatus);
                }
                else if(res['info'][0]['booking_status'] === "2"){
                    this.hasStarted = true;
                    this.isCancelled = true;
                    this.hasResumed = true;
                }
                else if(res['info'][0]['booking_status'] === "3"){
                    this.isPaused = true;
                    this.hasStarted = true;
                    this.isCancelled = true;
                    this.hasResumed = false;
                }
                else if(res['info'][0]['booking_status'] === "1"){
                    this.isCancelled = false;
                    this.hasCompleted = true;
                    this.hasStarted = true;
                    this.isPaused = true;
                    this.hasResumed = true;
                }
                else if(res['info'][0]['booking_status'] === "6"){
                    this.hasStarted = true;
                    this.isPaused = false;
                    this.isCancelled = true;
                    this.hasResumed = true;
                }

                // if(this.booking['has_paid'] == "1"){
                //     this.hasPaid = true;
                // }
            });
        }
    }

    getBookingTimeline() {
        this.timelineArr.length = 0;
        let timelinePayload = new FormData();
        timelinePayload.append('booking_id', this.booking['booking_id']);
        timelinePayload.append('user_id', localStorage.getItem('user_id'));

        this.commonService.bookingTimeline(timelinePayload).then(res => {
            
            let time = res['location'][0]['requested_at'];
            let action  = "You requested";
            var activity = "";
            this.booking['services'].forEach(element => {
                activity += element.service_name+","
            });
            activity = activity.slice(0, -1)
            activity += " Services";

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            
            this.requestedAt = res['location'][0]['requested_at'];

            time = res['location'][0]['accepted_at'];
            action = "Auto assigned";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.acceptedAt = res['location'][0]['accepted_at'];

            time = res['location'][0]['reached_location_at'];
            action = "Reached location at";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.reachedLocationAt = res['location'][0]['reached_location_at'];

            time = res['location'][0]['job_started_at'];
            action = "Started at";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.jobStartedAt = res['location'][0]['job_started_at'];

            time = res['location'][0]['job_completed_at'];
            action = "Completed at";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.jobCompletedAt = res['location'][0]['job_completed_at'];

            time = res['location'][0]['job_paused_at'];
            action = "Paused at";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.jobPausedAt = res['location'][0]['job_paused_at'];

            time = res['location'][0]['job_restarted_at'];
            action = "Restarted at";
            activity = this.booking['vendor_name'];

            this.timelineArr.push({
                "time": time,
                "action": action,
                "activity": activity
            });
            this.jobRestartedAt = res['location'][0]['job_restarted_at'];
            this.sortArrayByDateTime(this.timelineArr);
        });

        let commentData = new FormData();
        commentData.append('booking_id', this.booking['booking_id']);
        this.commonService.getComments(commentData).then(res=>{
            this.commentsArr = res['data']['result'];
            let time = "", action = "", activity = "";
            if(this.commentsArr.length){
                this.commentsArr.forEach(element => {
                    time = element.created_at;
                    action = "You commented";
                    activity = element.comment;
                    this.timelineArr.push({
                        "time": time,
                        "action": action,
                        "activity": activity
                    });
                });
            }
            this.sortArrayByDateTime(this.timelineArr);
        });
    }

    sortArrayByDateTime(arr){
        arr.sort((a, b)=>{
            if(a.time == "" || b.time == ""){
                
            }else{
                return a.time - b.time;
            }
        });
    }

    ionViewDidEnter() {
        this.getBookingTimeline();
        this.checkBookingStatus = setInterval(()=>{
            this.getBookingStatus();
        }, 3000);
    }



    showMap(lat, lng) {
        const location = new google.maps.LatLng(lat, lng);

        const options = {
            center: location,
            zoom: 15,
            zoomControl: false, mapTypeControl: false
        };

        this.map = new google.maps.Map(this.mapRef.nativeElement, options);

        this.addMarker(location, this.map);
        if (this.booking['booking_status'] === "1") {
            let postData = new FormData();
            postData.append('user_id', this.booking['customer_id']);
            postData.append('booking_id', this.booking['booking_id']);
            if (this.booking['reached_location_at'] == "") {
                this.checkDistance = setInterval(() => {

                    this.commonService.getVendorLocation(postData).then((res) => {
                        if (res['location']['distance'] < 10) {
                            let vLocation = new google.maps.LatLng(parseFloat(res['location']['vendor_lat']), parseFloat(res['location']['vendor_lng']));
                            this.vendorMarker(vLocation, this.map);
                            this.platform.ready().then(() => {
                                this.localNotifications.schedule({
                                    id: 1,
                                    title: 'Troubleshooter',
                                    text: this.booking['vendor_name'] + ' has reached your location'
                                });

                                this.showAlert("Vendor reached!", this.booking['vendor_name'] + ' has reached your location');
                            });
                            this.hasReachedLocation = true;
                            clearInterval(this.checkDistance);
                        }
                        else {
                            let vLocation = new google.maps.LatLng(parseFloat(res['location']['vendor_lat']), parseFloat(res['location']['vendor_lng']));
                            this.vendorMarker(vLocation, this.map);
                        }
                    });
                }, 5000);
            }
            else{
                this.hasReachedLocation = true;
            }
        }

    }

    addMarker(position, map) {
        return new google.maps.Marker({ position, map });
    }

    vendorMarker(position, map) {
        if (this.vMarker && this.vMarker.setMap) {
            this.vMarker.setMap(null);
        }
        this.vMarker = new google.maps.Marker({ position, map });
        return this.vMarker;
    }

    callVendor(mob_num) {
        this.callNumber.callNumber(mob_num, true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
    }

    startBooking() {
        let postData = new FormData();
        postData.append('user_id', this.booking['customer_id']);
        postData.append('booking_id', this.booking['booking_id']);
        postData.append('booking_status', "2");

        this.commonService.updateBooking(postData).then((res) => {
            if (res['status']) {
                this.hasStarted = true;
                this.showAlert("Started!", res['message']);
                this.booking['booking_status'] = "2";
                this.isCancelled = true;
                this.hasCompleted = true;
                this.hasReachedLocation = false;
                this.isPaused = false;
                this.getBookingTimeline();
            }
        });
    }

    pauseBooking() {
        let postData = new FormData();
        postData.append('user_id', this.booking['customer_id']);
        postData.append('booking_id', this.booking['booking_id']);
        postData.append('booking_status', "3");

        this.commonService.updateBooking(postData).then((res) => {
            if (res['status']) {
                this.hasStarted = true;
                this.showAlert("Paused!", res['message']);
                this.booking['booking_status'] = "3";
                this.isPaused = true;
                this.hasResumed = false;
                this.getBookingTimeline();
            }
        });
    }

    resumeBooking() {
        let postData = new FormData();
        postData.append('user_id', this.booking['customer_id']);
        postData.append('booking_id', this.booking['booking_id']);
        postData.append('booking_status', "6");

        this.commonService.updateBooking(postData).then((res) => {
            if (res['status']) {
                this.hasStarted = true;
                this.showAlert("Resumed!", res['message']);
                this.booking['booking_status'] = "6";
                this.isPaused = false;
                this.hasResumed = true;
                this.getBookingTimeline();
            }
        });
    }

    cancelBooking() {
        let postData = new FormData();
        postData.append('user_id', this.booking['customer_id']);
        postData.append('booking_id', this.booking['booking_id']);
        postData.append('booking_status', "4");

        this.commonService.updateBooking(postData).then((res) => {
            if (res['status']) {
                this.isCancelled = true;
                this.hasStarted = true;
                this.hasReachedLocation = false;
                this.isPaused = true;
                this.hasPaid = true;
                this.hasFinallyCompleted = true;
                this.showAlert("Cancelled", res['message']);
                this.booking['booking_status'] = "4";
                let latlng = { lat: parseFloat(this.booking['booking_lat']), lng: parseFloat(this.booking['booking_lng']) };
                this.showMap(latlng.lat, latlng.lng);
                clearInterval(this.checkDistance);
                this.getBookingTimeline();
            }
        });
    }

    completeBooking() {
        let postData = new FormData();
        postData.append('user_id', this.booking['customer_id']);
        postData.append('booking_id', this.booking['booking_id']);
        postData.append('booking_status', "5");

        this.commonService.updateBooking(postData).then((res) => {
            if (res['status']) {
                this.hasCompleted = true;
                this.hasStarted = true;
                this.isPaused = true;
                this.isCancelled = true;
                this.hasPaid = true;
                this.showAlert("Completed!", res['message']);
                this.booking['booking_status'] = "5";
                this.getBookingTimeline();
            }
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

    payment() {
        this.navCtrl.push(FinalPaymentPage, { booking_id: this.booking['booking_id'], vendor_id: this.booking['vendor_id'], vendor_name: this.booking['vendor_name'] });
    }

    goBack() {
        this.navCtrl.setRoot(RequestsPage, {}, { animate: true, direction: 'back' });
    }
}