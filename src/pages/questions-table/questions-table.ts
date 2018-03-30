import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
import {ThankyouPage} from "../thankyou/thankyou";
import {HomePage} from "../home/home";
import {el} from "@angular/platform-browser/testing/src/browser_util";


/**
 * Generated class for the QuestionsTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-questions-table',
  templateUrl: 'questions-table.html',
})
export class QuestionsTablePage {
  developers:any[] = [];
  questionsArray:any[] = [];
  options:any[] = [];
  tempAnswer:any[] = [];
  list:any;
  suggestion_text;
  crm_key = [];
  selectedMultiple;
  selectedOptions;
  str_array  =[];
  answers = [];
  lastQuestion :boolean =false;
  eventId;
  participantId;
  backButtonShow:boolean = true;
  questionId;
  checked:boolean = false;
  crm_val = [];
  responseArray:any[] =[];
  questionType;
  questionsArrayLength;
  questionsValue;
  selectedOption;
  selectedOptionsFinal;
  selectedOptionPrev;
  questions;
  i= 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseProvider: DatabaseProvider) {
    this.questionsArray =  JSON.parse(this.navParams.get("questions"));
    this.questionsArrayLength = this.questionsArray.length;
    // alert(this.navParams.get("eventName"));
    this.eventId = this.questionsArray[this.questionsArrayLength - 1 - this.i].Event_ID;
    this.participantId = this.questionsArray[this.questionsArrayLength - 1 - this.i].PARTICIPANTS_ID;
    this.loadQuestion();
    if(this.i<=0)
    {
      this.backButtonShow = false;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionsTablePage');
  }

  loadQuestion(){
    console.log("loadQuestion()");
    let env = this;
    if (this.i > this.questionsArrayLength){
      alert("Last Question");
      for(let response of this.responseArray)
      {
        env.databaseProvider.addResponse(env.eventId,env.participantId,response.QUESTION_ID,response.RESPONSE);
        console.log("QUESTION_ID->"+response.QUESTION_ID +" RESPONSE->" + response.RESPONSE);
      }
      // console.log(this.responseArray.toString())
    }

    // if (this.i == this.questionsArrayLength-1){
    //   this.lastQuestion = true;
    // }
    else {
      console.log("Loading Events");
      let env = this;

      this.questions = this.questionsArray[this.questionsArrayLength - 1 - this.i];
      console.log(this.questions.Event_ID + "->" + "->" + this.questions.PARTICIPANTS_ID + "->" + this.questions.QUESTION_ID + "->" + this.questions.QUESTIONS + "->" + this.questions.OPTIONS);
      this.questionId = this.questions.QUESTION_ID;
      this.questionsValue = this.questions.QUESTIONS;
      this.list = JSON.parse(this.questions.OPTIONS);
      this.questionType = this.questions.QUESTION_TYPE;
      console.log("questionType-> "+this.questionType);
      this.crm_key = [];
      this.crm_val = [];
      for (let k in this.list) {
        this.crm_key.push(k);
        let value = this.list[k];
        this.crm_val.push(value);
      }
      if (this.i == this.questionsArrayLength-1){
        this.lastQuestion = true;
      }
    }
  }



  alertOnly(){
    // alert("Working");
    console.log("Home");
    this.navCtrl.push(HomePage);
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

  nextPage(){
    this.navCtrl.push(ThankyouPage);
  }

  nextQuestion(){

    for(let response of this.responseArray)
    {
      console.log("RESPONSE START->> "+response.RESPONSE);
    }
    this.backButtonShow = true;
    let env = this;
    console.log("Selected->" + env.selectedOptionsFinal);
    if(this.questionType=="multiple") {
      if (env.answers.length == 0) {

        this.selectedMultiple = this.responseArray[this.i].RESPONSE;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedMultiple,
        };
      }
      else {
        let responseString: string = "";
        console.log("its undefined");
        for (let ans of env.answers) {
          responseString = ans + "," + responseString;
        }
        env.selectedMultiple = responseString;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedMultiple,
        };
      }
    }
    else if(this.questionType=="single") {
      if (this.selectedOptionsFinal == undefined) {
        console.log("I am in if");
        if (this.responseArray.length > 0) {
          console.log("this.responseArray[this.i].RESPONSE->" + this.responseArray[this.i].RESPONSE);
          this.selectedOptionsFinal = this.responseArray[this.i].RESPONSE;
          this.responseArray[this.i] = {
            QUESTION_ID: this.questionId,
            RESPONSE: this.selectedOptionsFinal,
          };
        }
      }
      else {
        console.log("I am in else");
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedOptionsFinal,
        };
      }
    }
    else if(this.questionType=="suggestion")
    {
      if(this.suggestion_text == undefined)
      {
        this.suggestion_text = this.responseArray[this.i].RESPONSE;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.suggestion_text,
        };
      }
      else {
        console.log("suggestion_text-> " + this.suggestion_text);
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.suggestion_text,
        };
      }
    }
    for(let response of this.responseArray)
    {
      console.log("RESPONSE->> "+response.RESPONSE);
    }

    env.answers =[];
    this.selectedOptionsFinal = undefined;
    this.selectedOption = undefined;
    this.suggestion_text = undefined;
    this.selectedMultiple = undefined;
    this.checkNextQuestionAnswer();
  }

  prevPage(){
    let env = this;
    if (this.i<this.questionsArrayLength)
    {
      this.lastQuestion = false;
    }
    if(this.questionType=="multiple") {
      if (env.answers.length == 0) {
        // let responseString:string = "";

        this.selectedMultiple = this.responseArray[this.i].RESPONSE;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedMultiple,
        };
      }
      else {
        let responseString: string = "";
        console.log("its undefined");
        for (let ans of env.answers) {
          responseString = ans + "," + responseString;
        }
        env.selectedMultiple = responseString;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedMultiple,
        };
      }
    }
    else if(this.questionType == "single") {
      if (this.selectedOptionsFinal == undefined) {
        console.log("I am in if");
        this.selectedOptionsFinal = this.responseArray[this.i].RESPONSE;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedOptionsFinal,
        };
      }
      else {
        console.log("I am in else");
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.selectedOptionsFinal,
        };
      }
    }
    else if(this.questionType=="suggestion")
    {
      if(this.suggestion_text == undefined)
      {
        this.suggestion_text = this.responseArray[this.i].RESPONSE;
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.suggestion_text,
        };
      }
      else {
        console.log("suggestion_text-> " + this.suggestion_text);
        this.responseArray[this.i] = {
          QUESTION_ID: this.questionId,
          RESPONSE: this.suggestion_text,
        };
      }
    }
    this.answers = [];
    this.i--;
    // this.selectedOption ="";
    this.selectedOptionPrev ="";
    this.suggestion_text = this.responseArray[this.i].RESPONSE;
    this.selectedOptionPrev = this.responseArray[this.i].RESPONSE;
    if (this.selectedOptionPrev.indexOf(',') > -1) {
      console.log("Multiple");
      this.str_array = [];
      this.str_array = this.selectedOptionPrev.split(',');

      for(let i = 0; i < this.str_array.length; i++) {
        this.str_array[i] = this.str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
      }
      for(let selectedOptions of this.str_array)
      {
        this.answers.push(selectedOptions);
      }
    }
    console.log("Prev answer->" + this.selectedOptionPrev);
    if(this.i<=0)
    {
      this.backButtonShow = false;
    }
    for(let response of this.responseArray)
    {
      console.log("RESPONSE->> "+response.RESPONSE);
    }
    this.selectedOptionsFinal =undefined;
    this.selectedMultiple = undefined;
    console.log("back Button");
    this.loadQuestion();

  }
  selecteServer(answer){
    this.selectedOption = answer;
    this.selectedOptionsFinal = answer;

    if(this.answers.length!=0)
    {

    }
    console.log(this.selectedOption);
  }

  consoleOnly(j){

    var found = false;

    for(let ans of this.str_array)
    {
      // console.log("ans->"+ ans + "i value->" + j );
      if(j == ans)
      {
        //this.checked = true;
        found =  true;
      }
      // console.log("checked->" + this.checked);
    }

    return found;
  }
  checkNextQuestionAnswer(){
    console.log("checkNextQuestionAnswer");
    this.i++;
    console.log("this.responseArray[this.i].RESPONSE->" + this.responseArray.length +" I length " + this.i);
    if(this.responseArray.length > this.i ){
      this.selectedOptionPrev = this.responseArray[this.i].RESPONSE;
      console.log("checkNextQuestionAnswer selectedOptionPrev->" + this.selectedOptionPrev);
      if (this.selectedOptionPrev.indexOf(',') > -1) {
        console.log("Multiple");
        this.str_array = [];
        this.str_array = this.selectedOptionPrev.split(',');

        for(let i = 0; i < this.str_array.length; i++) {
          this.str_array[i] = this.str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
        }
        for(let selectedOptions of this.str_array)
        {
          this.answers.push(selectedOptions);
        }

      }
      console.log("Prev answer->" + this.selectedOptionPrev);
      this.suggestion_text = this.selectedOptionPrev;

    }
    this.loadQuestion();
  }

  removeElementFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }

}
