import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Http} from "@angular/http";
import {DatabaseProvider} from "../../providers/database/database";
import { ModalController } from 'ionic-angular';
import {AuthPage} from "../auth/auth";
import {HomePage} from "../home/home";

/**
 * Generated class for the OptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-option',
  templateUrl: 'option.html',
})
export class OptionPage {
  loadingPopup;
  developers:any[] = [];
  response:any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,public http: Http,
              public dbProvider: DatabaseProvider,public modalCtrl : ModalController) {
    let env = this;

    env.loadingPopup = env.loadingCtrl.create({
      content: "Fetching Events...",
      spinner: 'circles'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OptionPage');
  }

  syncResponseData(){
    let env = this;
    env.loadingPopup.present();
    env.dbProvider.getAllResponse().then(data=>{
      env.response = data;
      for(let response of env.response)
      {
        let body = new FormData();
        body.append('event_id', response.Event_ID);
        body.append('participant_id',response.PARTICIPANTS_ID);
        body.append('question_id', response.QUESTION_ID);
        body.append('response', response.RESPONSE);
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
      env.loadingPopup.dismiss();
    }).catch(error=>{
      alert("Check Internet Connection");
    })
  }

  updateAppData(){
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
                member_id = member_id + 101;
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
             env.loadingPopup.dismiss();
      console.log("error->" + error2);
    });
  }

  deleteAppData(){
    let data = { message : 'appData' };
    let modalPage = this.modalCtrl.create('AuthPage',data);
    modalPage.present();
  }
  deleteResponse(){
    let data = { message : 'responseData' };
    let modalPage = this.modalCtrl.create('AuthPage',data);
    modalPage.present();
  }

  onBack(){
    this.navCtrl.push(HomePage)
  }

  selectEvent(){
    this.navCtrl.push(HomePage,{source:true},{});
  }

}
