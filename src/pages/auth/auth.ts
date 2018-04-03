import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import {DatabaseProvider} from "../../providers/database/database";
/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {
  username;
  password;
  dataFromOptions;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl : ViewController,public dbProvider:DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
   this.dataFromOptions = this.navParams.get('message');

  }

  closeModal(){
    this.viewCtrl.dismiss();
  }
  submit(){
    let env = this;
    console.log("->"+this.username + this.password);
    if(this.username=='admin' && this.password=='admin') {
      if (this.dataFromOptions == 'appData') {
        env.dbProvider.deleteEventData().then(data => {
          env.dbProvider.deleteParticipantData().then(data => {
            env.dbProvider.deleteQuestionData().then(data => {
              console.log(this.dataFromOptions + " Deleted");
              env.viewCtrl.dismiss();
            })
          })
        });
        alert(this.dataFromOptions+ " Success");
      }
      else {
        env.dbProvider.deleteResponseData().then(data=>{
          console.log(this.dataFromOptions+ " Deleted");
          env.viewCtrl.dismiss();
        })
      }
    }
    else {
      alert("Worng Username/Password");
    }
  }

}
