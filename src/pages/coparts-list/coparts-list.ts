import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {ThankyouPage} from "../thankyou/thankyou";
import {HomePage} from "../home/home";
import {Http} from "@angular/http";
import {ParticipantListPage} from "../participant-list/participant-list";

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
  answers = [];
  loadingPopup;
  isCheckbox:boolean = false;
  isCopart;
  participantUniqueId;
  requestComeFromePage;
  participantId;
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbProvider:DatabaseProvider,
              public loadingCtrl:LoadingController,public http: Http ) {
    let env = this;
    env.loadingPopup = env.loadingCtrl.create({
      content: "Saving your response...",
      spinner: 'circles'
    });
     env.requestComeFromePage =  env.navParams.get('requestComeFromePage');
    // env.loadingPopup.present();
    if(env.requestComeFromePage == 'participantsPage')
    {
      this.isCopart = env.navParams.get('eventCopart');
      console.log("requestComeFromePage -> " +env.requestComeFromePage);
      this.isCheckbox = true;
    }
    else {
      env.participantId = env.navParams.get('paticipantId');
      env.responseArray = JSON.parse(env.navParams.get('response'));
    }
    env.eventId = env.navParams.get('eventId');
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
    let env = this;
    if(env.requestComeFromePage == 'participantsPage')
    {
      this.navCtrl.push(ParticipantListPage,{eventId:this.eventId,eventCopart:this.isCopart},{})
    }
    else {
      env.loadingPopup.present();
      for(let response of env.responseArray){
        env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE);
        console.log(env.eventId+" => "+env.participantId +" -> " +response.QUESTION_ID + " ->" + response.RESPONSE);
        env.sendDetailsToServer(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE);
      }
      env.dbProvider.deleteCoPart(env.participantUniqueId).then(data=>{
        setTimeout(function () {
          env.loadingPopup.dismiss();
          env.navCtrl.push(HomePage);
        },3000);
      })
    }

  }

  selecteServer(answer,uniqueId){
    this.selectedOption = answer;
    this.participantUniqueId = uniqueId;
    console.log(this.selectedOption + "this.participantUniqueId-> " + this.participantUniqueId);
  }
  goToHomePage(){
    this.navCtrl.push(HomePage);
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

  onChange(id, isChecked) {
    let env =this;

    // nested formarray, which is inside nested formgroup, inside outer array
    // console.log(id+isChecked+index);
    console.log("isChecked->" + isChecked);
    if(isChecked) {
      env.answers.push(id);
    }
    else {
      let answersLength = env.answers.length;
      console.log("Length->" + answersLength);
      this.removeElementFromArray(this.answers,id);
      env.answers.splice(answersLength-1,1);
    }
    console.log(env.answers)
  }

  removeElementFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

}
