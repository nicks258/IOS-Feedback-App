import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {Http} from "@angular/http";
import {DatabaseProvider} from "../../providers/database/database";

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
  loadingPopup;
  participantId;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http,
              public dbProvider: DatabaseProvider) {
    let env = this;
    env.loadingPopup = env.loadingCtrl.create({
      content: "Saving your response...",
      spinner: 'circles'
    });
    env.loadingPopup.present();
    env.responseArray = JSON.parse(env.navParams.get('response'));
    env.eventId = env.navParams.get('eventId');
    env.participantId = env.navParams.get('paticipantId');
    for(let response of env.responseArray){
      env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE);
      console.log(env.eventId+" => "+env.participantId +" -> " +response.QUESTION_ID + " ->" + response.RESPONSE);
      env.sendDetailsToServer(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE);
    }

    setTimeout(function () {
      env.navCtrl.push(HomePage);
      env.loadingPopup.dismiss();
    },3000)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ThankyouPage');
  }

  sendDetailsToServer(eventId,participantId,questionId,response) {
      let body = new FormData();
      body.append('event_id', eventId);
      body.append('participant_id',participantId);
      body.append('question_id', questionId);
      body.append('response', response);
      let headers = new Headers();
      let options = {headers: headers};
      this.http.post('http://52.66.132.37/feed_back_app/Rest/insertresponses/', body).subscribe(data => {
        console.log(data);
        //      loadingPopup.dismiss();
        let data_to_use = data.json();
        console.log(data_to_use);
      }, error2 => {
        //        loadingPopup.dismiss();
        console.log("error->" + error2);
      });
  }
}
