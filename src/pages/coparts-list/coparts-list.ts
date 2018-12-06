import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {ThankyouPage} from "../thankyou/thankyou";
import {HomePage} from "../home/home";
import {Http} from "@angular/http";
import { Device } from '@ionic-native/device';
import {ParticipantListPage} from "../participant-list/participant-list";
import {Storage} from "@ionic/storage";
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";

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
  feedbackId:number;
  isCheckbox:boolean = false;
  isCopart;
  url;
  testing = false;
  participantUniqueId;
  requestComeFromePage;
  participantId;
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbProvider:DatabaseProvider,
              public loadingCtrl:LoadingController,public http: Http,public device: Device,private storage: Storage,
              public remote:RemoteServiceProvider) {
    let env = this;
    env.loadingPopup = env.loadingCtrl.create({
      content: "Saving your response...",
      spinner: 'circles'
    });
    env.url = remote.baseUrl;
    env.requestComeFromePage =  env.navParams.get('requestComeFromePage');
    env.feedbackId = env.navParams.get('FEEDBACK_ID');
    env.storage.get('testing').then(data=>{
      env.testing  = data;
    }).catch(error=>{
      env.testing = false;
    });
    // env.loadingPopup.present();
    if(env.requestComeFromePage == 'participantsPage')
    {
      this.isCopart = env.navParams.get('eventCopart');
      console.log("requestComeFromePage -> " +env.requestComeFromePage);
      this.isCheckbox = true;
    }
    else {
      this.isCopart = env.navParams.get('isCopart');
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
      if(this.testing == null)
      {
        this.testing = false;
      }
      let device_id = this.device.uuid;
      for(let response of env.responseArray){
        let timestamp = new Date().getTime() + this.device.uuid;
        // console.log(env.eventId+" => "+env.participantId +" -> " +response.QUESTION_ID + " ->" + response.RESPONSE);
        // console.log("value->" + env.sendDetailsToServer(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE,timestamp));
        env.sendDetailsToServer(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE,timestamp,device_id,this.testing);
        env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.QUESTION,response.RESPONSE,timestamp,env.feedbackId,device_id,this.testing,this.selectedOption);
        // if(){
        //
        // }
        // else {
        //   env.dbProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.QUESTION,response.RESPONSE,timestamp);
        // }
      }
      env.dbProvider.deleteCoPart(env.participantUniqueId).then(data=>{
        setTimeout(function () {
          env.storage.set('feedbackId',env.feedbackId).then(data=>{
            env.navCtrl.push(ParticipantListPage,{eventId:env.eventId,eventCopart:env.isCopart,FEEDBACK_ID:this.feedbackId});
            env.loadingPopup.dismiss();
          });
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

  sendDetailsToServer(eventId,participantId,questionId,response,timestamp,ipad_id,testing)  {
    let body = new FormData();
    let env = this;
    if(testing == null)
    {
      testing = false;
    }
    body.append('event_id', eventId);
    body.append('participant_id',participantId);
    body.append('question_id', questionId);
    body.append('response', response);
    body.append('timestamp',timestamp);
    body.append('testing',testing);
    body.append('copart_id',this.selectedOption);
    body.append('feedback_id',""+env.feedbackId);
    body.append('ipad_id',ipad_id);
    let headers = new Headers();
    let options = {headers: headers};
    this.http.post(this.url + 'insertresponses/', body).subscribe(data => {
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
