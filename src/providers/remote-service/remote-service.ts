
import { Injectable } from '@angular/core';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class  RemoteServiceProvider {
  baseUrl:string = "http://52.66.132.37/feed_back_app_updated/Rest/";
  constructor() {
    console.log('Hello RemoteServiceProvider Provider');
  }

}
