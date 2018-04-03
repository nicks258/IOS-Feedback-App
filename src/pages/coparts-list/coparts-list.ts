import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {ThankyouPage} from "../thankyou/thankyou";
import {HomePage} from "../home/home";

/**
 * Generated class for the CopartsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coparts-list',
  templateUrl: 'coparts-list.html',
})
export class CopartsListPage {
  responseArray:any[] = [];
  eventId;
  coPartsList:any[];
  selectedOption;
  loadingPopup;
  participantId;
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbProvider:DatabaseProvider,
              public loadingCtrl:LoadingController ) {
    let env = this;
    env.loadingPopup = env.loadingCtrl.create({
      content: "Saving your response...",
      spinner: 'circles'
    });
    // env.loadingPopup.present();
    env.responseArray = JSON.parse(env.navParams.get('response'));
    env.eventId = env.navParams.get('eventId');
    env.participantId = env.navParams.get('paticipantId');
    env.loadCoParts(env.eventId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CopartsListPage');
  }

  loadCoParts(eventId){
    let env= this;
    env.dbProvider.getParticipantsCoparts(eventId).then(data=>{
      env.coPartsList = data;
      for(let coparts of env.coPartsList)
      {
        console.log(coparts.PARTICIPANTS_NAME);
      }
    })
  }
  onSubmitButton(){
    console.log("selected=> "+this.selectedOption);
    let env = this;
    for(let response of this.responseArray)
    {
      env.dbProvider.addResponse(env.eventId,env.selectedOption,response.QUESTION_ID,response.RESPONSE);
      console.log("QUESTION_ID->"+response.QUESTION_ID +" RESPONSE->" + response.RESPONSE);
    }
    this.navCtrl.push(ThankyouPage, {
      response: JSON.stringify(this.responseArray),
      eventId: this.eventId,
      paticipantId: this.selectedOption
    });
  }

  selecteServer(answer){
    this.selectedOption = answer;
    console.log(this.selectedOption);
  }
  goToHomePage(){
    this.navCtrl.push(HomePage);
  }

}
