import { Component, ViewChild } from '@angular/core';
import { CommonService } from '../../providers/common-service/common-service';
import { NavController, Slides, LoadingController } from 'ionic-angular';

import { TrackBookingPage } from '../track-booking/track-booking';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html'
})
export class RequestsPage {

  @ViewChild('SwipedTabsSlider') SwipedTabsSlider: Slides ;
  status: string = "assigned";
  pendingBookings = [];
  completedBookings = [];
  tabs:any=[];
  SwipedTabsIndicator :any= null;
  constructor(public commonService:CommonService, public loading: LoadingController, private navCtrl: NavController) {
    this.tabs=["Upcoming","Completed"];
  }

  ionViewDidLoad(){
    
  }
  ionViewDidEnter() {
    this.SwipedTabsIndicator = document.getElementById("indicator");
  }

  selectTab(index) {    
    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(100*index)+'%,0,0)';
    this.SwipedTabsSlider.slideTo(index, 500);
  }

  updateIndicatorPosition() {
      // this condition is to avoid passing to incorrect index
  	if( this.SwipedTabsSlider.length()> this.SwipedTabsSlider.getActiveIndex())
  	{
  		this.SwipedTabsIndicator.style.webkitTransform = 'translate3d('+(this.SwipedTabsSlider.getActiveIndex() * 100)+'%,0,0)';
  	}
    
    }

  animateIndicator($event) {
  	if(this.SwipedTabsIndicator)
   	    this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (($event.progress* (this.SwipedTabsSlider.length()-1))*100) + '%,0,0)';
  }

  ionViewWillEnter(){
    let loader = this.loading.create({
      spinner: 'bubbles',
      content: 'Getting data...',
    });

    loader.present().then(() => {
      let fd = new FormData();
      fd.append('user_id', localStorage.getItem('user_id'));
      this.commonService.pendingBookings(fd).then((result) => {
        if(result['status']){
          this.pendingBookings = result['bookings'];
        }
        loader.dismiss();
      },
      error=>{
        loader.dismiss();
      });
    });
  }

  goToTrackBooking(booking){
    this.navCtrl.push(TrackBookingPage, {booking_details: booking});
  }
}
