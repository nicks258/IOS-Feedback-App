import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {OptionPage} from "../option/option";
/**
 * Generated class for the ServerChangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-server-change',
  templateUrl: 'server-change.html',
})
export class ServerChangePage {
  baseURL:string;
  serverType:boolean = false;
  testing:boolean;
  constructor(public navCtrl: NavController,public platform:Platform, public navParams: NavParams,private storage:Storage) {
    platform.ready().then(data=>{
     storage.get('testing').then(data=>{
       this.serverType = data;
       console.log("data=>" + data);
     }).catch(error=>{
       this.serverType = false;
     })
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServerChangePage');
  }
  submit(){
    let env = this;
    console.log("value-> "+ this.baseURL + "-> " + this.serverType);

    this.storage.set('testing',this.serverType).then(data=>{
      env.navCtrl.push(OptionPage);
    }).catch(error=>{
      console.log("Error-> "+ error);
    })

  }

}
