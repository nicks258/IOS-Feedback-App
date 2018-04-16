import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {HomePage} from "../home/home";
import {OptionPage} from "../option/option";

/**
 * Generated class for the ViewRecordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-records',
  templateUrl: 'view-records.html',
})
export class ViewRecordsPage {
  eventId;
  isCopart;
  eventName;
  response:any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbProvider:DatabaseProvider) {
    this.eventId = this.navParams.get('eventId');
    this.eventName = this.navParams.get('eventName');
    console.log("Event Id-> " + this.eventId + " eventName-> " + this.eventName);
    this.isCopart = this.navParams.get('eventCopart');
    this.getResponse(this.eventId)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewRecordsPage');
  }

  getResponse(eventId){
    this.dbProvider.getAllResponseByEventId(eventId).then(data=>{
      this.response = data;
      for(let response of data){
          console.log("QUESTIONS-> "+ response.QUESTIONS + " -> "+ response.RESPONSE);
      }

    }).catch(error=>{
      console.log("error View Records")
    })
  }
  HomePage(){
    this.navCtrl.push(OptionPage);
  }
  printCurrentPage(){
    alert("We are working on it");
  }

}
