import { Component } from '@angular/core';
import {Alert, IonicPage, LoadingController, NavController, NavParams, Platform} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Http} from "@angular/http";
import {DatabaseProvider} from "../../providers/database/database";
import {CopartsListPage} from "../coparts-list/coparts-list";
import {Network} from "@ionic-native/network";
import {Subscription} from 'rxjs/Subscription';
import {ParticipantListPage} from "../participant-list/participant-list";
import { Device } from '@ionic-native/device';
import {Storage} from "@ionic/storage";
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
/**
 * Generated class for the ThankyouPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-thankyou',
  templateUrl: 'thankyou.html',
})
export class ThankyouPage {
  responseArray:any[] = [];
  eventId;
  connected: Subscription;
  disconnected: Subscription;
  selectedType;
  feedbackId:number;
  loadingPopup;
  testing = false;
  url;
  isCopart;
  participantId;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http,
              public dbProvider: DatabaseProvider,private network: Network,public platform:Platform,public device: Device
              ,private storage: Storage,private remote:RemoteServiceProvider) {
    let env = this;
    env.loadingPopup = env.loadingCtrl.create({
      content: "Saving your response...",
      spinner: 'circles'
    });
    env.storage.get('testing').then(data=>{
      env.testing  = data;
    }).catch(error=>{
      env.testing = false;
    });
    env.url           = remote.baseUrl;
    env.responseArray = JSON.parse(env.navParams.get('response'));
    env.eventId       = env.navParams.get('eventId');
    env.participantId = env.navParams.get('paticipantId');
    env.isCopart      = env.navParams.get('isCopart');
    env.feedbackId    = env.navParams.get('FEEDBACK_ID');
    env.selectedType  = env.navParams.get('selectedType');
  }
  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  ionViewDidLoad() {
    // this.connected = this.network.onConnect().subscribe(data => {
    //   console.log(data);
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));
    //
    // this.disconnected = this.network.onDisconnect().subscribe(data => {
    //   console.log(data);
    //   this.displayNetworkUpdate(data.type);
    // }, error => console.error(error));
  }

  sendDetailsToServer(eventId,participantId,questionId,response,timestamp,ipad_id,testing) {
      let body = new FormData();
      let env = this;
      console.log("timestamp-> " + timestamp);
      body.append('event_id', eventId);
      body.append('participant_id',participantId);
      body.append('question_id', questionId);
      body.append('response', response);
      body.append('copart_id','NA');
      body.append('testing',testing);
      body.append('timestamp',timestamp);
      body.append('feedback_id',""+env.feedbackId);
      body.append('ipad_id',ipad_id);
      let headers = new Headers();
      let options = {headers: headers};
      this.http.post( this.url + 'insertresponses/', body).subscribe(data => {
        console.log(data);
        //      loadingPopup.dismiss();
        let data_to_use = data.json();
        console.log(data_to_use);
        return true;
      }, error2 => {
        //        loadingPopup.dismiss();
        console.log("error->" + error2);
        return false;
      });
  }

  nextPage(){
    let env = this;
    env.loadingPopup.present();
    if(this.selectedType == 'individual'){
      if(this.testing == null)
      {
        this.testing = false;
      }
        for(let response of env.responseArray){
          let deviceId = this.device.uuid;
          let timestamp = new Date().getTime() + this.device.uuid;
          console.log(env.eventId+" => "+env.participantId +" -> " +response.QUESTION_ID +" -> "+ response.QUESTION +" -> " + response.RESPONSE);
          env.sendDetailsToServer(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE,timestamp,deviceId,this.testing);
          env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.QUESTION,response.RESPONSE,timestamp,env.feedbackId,deviceId,this.testing,'NA');
          // if()) {
          //
          // }
          // else {
          //   env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.QUESTION,response.RESPONSE,timestamp);
          // }
        }
      setTimeout(function () {
        env.storage.set('feedbackId',env.feedbackId).then(data=>{
          env.navCtrl.push(ParticipantListPage,{eventId:env.eventId,eventCopart:env.isCopart,FEEDBACK_ID:this.feedbackId});
          env.loadingPopup.dismiss();
        });
      },3000)
    }
    else {
      env.loadingPopup.dismiss();
      env.navCtrl.push(CopartsListPage,{
        response: JSON.stringify(this.responseArray),
        eventId: this.eventId,
        paticipantId: this.participantId,
        isCopart:this.isCopart,
        FEEDBACK_ID:this.feedbackId
      });
    }
  }

  // displayNetworkUpdate(connectionState: string){
  //   let networkType = this.network.type;
  //   console.log("You are now "+ connectionState + " via " +networkType);
  // }
  // checkNetwork() {
  //   this.platform.ready().then(() => {
  //    console.log("Network -> " + this.network.)
  //     this.navCtrl.present(alert);
  //   });
  // }
}
