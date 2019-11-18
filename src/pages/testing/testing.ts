import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-testing',
  templateUrl: 'testing.html',
})
export class TestingPage {
  relationship:any;
  isQuestionMe:any = 'rating';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  clickMe(){
    let env = this;
    console.log(this.relationship);
    setTimeout(function () {
      console.log("Testing");
      env.isQuestionMe = 'sdc';
      env.relationship = null;
      env.tester();
    },500);
  }

  tester(){
    let env = this;
    setTimeout(function () {
      console.log("Testing1");
      env.isQuestionMe = 'rating';

    },500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestingPage');
  }

}
