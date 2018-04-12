import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Http} from "@angular/http";
import {DatabaseProvider} from "../../providers/database/database";
import {QuestionsTablePage} from "../questions-table/questions-table";
import {HomePage} from "../home/home";
import {Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Gesture} from 'ionic-angular/gestures/gesture';
import {CopartsListPage} from "../coparts-list/coparts-list";
/**
 * Generated class for the ParticipantListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-participant-list',
  templateUrl: 'participant-list.html',
})
export class ParticipantListPage{
  @Output()
  longPress:EventEmitter<any>;
  loadingPopup;
  eventId;

  isCopart;
  participantsNames:any[] = [];
  copartsParticipantsNames:any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public http:Http,
              public loadingCtrl:LoadingController,public dbProvider:DatabaseProvider) {

    let env = this;
    // env.loadingPopup = env.loadingCtrl.create({
    //   content: "Fetching Events...",
    //   spinner: 'circles'
    // });
    // env.loadingPopup.present();
    this.eventId = env.navParams.get("eventId");
    this.isCopart = env.navParams.get("eventCopart");
    console.log("isCopart->" + this.isCopart);
    env.loadPaticipantList(this.eventId);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ParticipantListPage');
  }

  loadPaticipantList(eventId){
    let env = this;
    env.dbProvider.getParticipants(eventId).then(data=>{
      console.log(data);
      let participantList = data;
      for(let participant of participantList){
        env.participantsNames.push({
          PARTICIPANTS_NAME : participant.PARTICIPANTS_NAME,
          PARTICIPANTS_ID : participant.PARTICIPANTS_ID,
        });
        console.log(participant.PARTICIPANTS_NAME);
      }
    }).catch(error=>{
      console.log("Error loadPaticipantList");
    });

    env.dbProvider.getParticipantsCoparts(eventId).then(data=>{
      let coparts = data;
      for(let copartParticipants of coparts) {
        env.copartsParticipantsNames.push({
          PARTICIPANTS_NAME : copartParticipants.PARTICIPANTS_NAME,
          PARTICIPANTS_ID : copartParticipants.PARTICIPANTS_ID,
        });
        console.log(copartParticipants.PARTICIPANTS_NAME);
      }
    }).catch(error=>{
      console.log("Error loadCoparts PaticipantList");
    });
  }

  loadQuestions(participantId){
    let env = this;
    let questionsArray = [];
    let eventId = env.eventId;
    // alert(participantId);
    this.dbProvider.getAllQuestions(participantId,eventId).then(data => {
      // questionsArray = data;
      // console.log(data);
      for(let dev of data)
      {
        // console.log(dev.firstname + "->" + dev.lastname + "->" + dev.email);
        console.log(dev.Event_ID + "->" + "->" + dev.PARTICIPANTS_ID + "->" + dev.QUESTION_ID + "->" + dev.QUESTIONS + "->" + dev.OPTIONS + dev.QUESTION_TYPE);

        questionsArray.push({
          Event_ID: dev.Event_ID,
          PARTICIPANTS_ID: dev.PARTICIPANTS_ID,
          QUESTION_ID: dev.QUESTION_ID,
          QUESTIONS: dev.QUESTIONS,
          OPTIONS: dev.OPTIONS,
          QUESTION_TYPE: dev.QUESTION_TYPE,
        });
      }

      console.log("Ready for next Page");
      env.navCtrl.push(QuestionsTablePage,{questions:JSON.stringify(questionsArray),selectedType:"individual"},{});
    }).catch(error=>{
      console.log("Home.ts error->" + error)
    });
  }

  loadQuestionsforCoparts(){
    let env = this;
    let questionsArray = [];
    let length = env.copartsParticipantsNames.length;
    let copartId = env.copartsParticipantsNames[length-1].PARTICIPANTS_ID;
    env.dbProvider.getAllQuestionsForCoparts(copartId,this.eventId).then(data=>{

      for(let dev of data)
      {
        // console.log(dev.firstname + "->" + dev.lastname + "->" + dev.email);
        console.log(dev.Event_ID + "->" + "->" + dev.PARTICIPANTS_ID + "->" + dev.QUESTION_ID + "->" + dev.QUESTIONS + "->" + dev.OPTIONS + dev.QUESTION_TYPE);

        questionsArray.push({
          Event_ID: dev.Event_ID,
          PARTICIPANTS_ID: dev.PARTICIPANTS_ID,
          QUESTION_ID: dev.QUESTION_ID,
          QUESTIONS: dev.QUESTIONS,
          OPTIONS: dev.OPTIONS,
          QUESTION_TYPE: dev.QUESTION_TYPE,
        });
      }

      console.log("Ready for next Page->"+ questionsArray);
      env.navCtrl.push(QuestionsTablePage,{questions:JSON.stringify(questionsArray),selectedType:"co_parts"},{});
    }).catch(error=>{
      console.log("Home.ts error->" + error)
    });

  }

  homePage(){
  this.navCtrl.push(HomePage);
  }

  longPressEvent($event) {
    this.navCtrl.push(CopartsListPage,{requestComeFromePage:'participantsPage',eventId:this.eventId,eventCopart:this.isCopart},{});

  }
}




