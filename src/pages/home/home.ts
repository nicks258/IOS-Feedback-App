import { Component } from '@angular/core';
import {LoadingController, NavController, Platform} from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {QuestionsTablePage} from "../questions-table/questions-table";
import {Http} from "@angular/http";
import {ParticipantListPage} from "../participant-list/participant-list";
import {OptionPage} from "../option/option";
import {OptionsPage} from "../options/options";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  event;
  eventName;
  developers:any[] = [];
  options:any[] = [];
  list:any;
  crm_key = [];
  crm_val = [];
  questionsArray = [];
  loadingPopup;
  questions;
  i;
  constructor(public navCtrl: NavController,public dbProvider:DatabaseProvider,public platform:Platform,
              public http:Http,public loadingCtrl:LoadingController ) {
    console.log("Constructer");
    let env = this;
    platform.ready().then(data=>{
      env.loadingPopup = env.loadingCtrl.create({
        content: "Fetching Events...",
        spinner: 'circles'
      });
      env.loadingPopup.present();
      // env.loadAllEvents();
      setTimeout(function () {
        env.loadAllEvents();
      },5000);

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  loadAllEvents(){
    console.log("Loading Events");
    let env = this;
    this.http.get('http://52.66.132.37/feed_back_app/Rest/getData', {}).map(res => res.json()).subscribe(data => {
      // console.log(data);
      //      loadingPopup.dismiss();
      let data_to_use = data;

      for (let i of data_to_use) {
        // let event_participants = i.event_participants;
        let event = i.event;
        let event_name = event.event_name;
        let event_Id = event.event_id;
        let is_coparts = i.is_coparts;
        console.log(event.event_id + "->" + event.event_name +"is_coparts->" + is_coparts);
        env.dbProvider.addEvents(event.event_id,event.event_name,is_coparts).then(data=>{

        }).catch(error=>{
          console.log("Error");
        });
        // console.log(i.event_participants);
        if (i.hasOwnProperty("event_participants")) {
          let event_participants = i.event_participants;
          for (let i of event_participants) {
            let participant_details = i.participant_details;
            let participant_questions = i.participant_questions;

            console.log("participant_id->" + participant_details.participant_id);
            console.log("participant_name->" + participant_details.participant_name);
            console.log("participant_type->" + participant_details.participant_type);
            if(participant_details.participant_name == 'Coparts')
            {
              let member_id;
              let group_member = i.group_members;
              for( let group of group_member)
              {
                let participant_group_member_name = group.participant_group_member_name;
                member_id = group.member_id;
                console.log( "member_id-> "+ member_id + "participant_group_member_name-> " + participant_group_member_name );

                env.dbProvider.addParticipants(event_Id,participant_details.participant_id, member_id, participant_group_member_name, participant_details.participant_type);
                }
              for (let participant_question of participant_questions) {
                let question_id = participant_question.question_id;
                let question = participant_question.question;
                let options = participant_question.options;
                let questionType = participant_question.question_type;
                env.dbProvider.addQuestions(event_Id, participant_details.participant_id, question_id, question, options,questionType)
              }
            }
            else {
              env.dbProvider.addParticipants(event_Id, participant_details.participant_id,participant_details.participant_id, participant_details.participant_name, participant_details.participant_type);
              for (let participant_question of participant_questions) {
                let question_id = participant_question.question_id;
                let question = participant_question.question;
                let options = participant_question.options;
                let questionType = participant_question.question_type;
                env.dbProvider.addQuestions(event_Id, participant_details.participant_id, question_id, question, options,questionType)
              }
            }


          }
        }
      }
      env.dbProvider.getAllEvents().then(data => {

        env.developers = data;
        console.log(data);
        for(let dev of env.developers)
        {
          // console.log(dev.firstname + "->" + dev.lastname + "->" + dev.email);
          console.log(dev.Event_ID + "->" + "->" + dev.EVENT_NAME );
        }

        env.loadingPopup.dismiss();
      }).catch(error=>{
        console.log("Home.ts error->" + error)
      });
    },error2 => {
      env.dbProvider.getAllEvents().then(data => {

        env.developers = data;
        console.log(data);
        for(let dev of env.developers)
        {
          // console.log(dev.firstname + "->" + dev.lastname + "->" + dev.email);
          console.log(dev.Event_ID + "->" + "->" + dev.EVENT_NAME );
        }

        env.loadingPopup.dismiss();
      }).catch(error=>{
        console.log("Home.ts error->" + error)
      });
      env.loadingPopup.dismiss();
      console.log("error->" + error2);
    });
  }

  loadParticipants(){

  }


  gotoQuestions(){

  }

  loadAllQuestions(){
    // this.navCtrl.push(QuestionsTablePage);
    let env = this;
    let eventId;
    let isCopart;
    env.dbProvider.getEventId(env.eventName).then(data=>{
        for(let dev of data)
        {
          eventId = dev.Event_ID;
          isCopart = dev.IS_COPARTS;
        }
      console.log("eventId=>" + eventId + "isCopart=>" + isCopart );
      env.navCtrl.push(ParticipantListPage,{eventId:eventId,eventCopart:isCopart},{});
    }).catch(error=>{
        console.log("Error");
    })
  }
  optionsPage(){
    this.navCtrl.push(OptionPage);
  }

}
