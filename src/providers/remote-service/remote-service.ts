
import { Injectable } from '@angular/core';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class  RemoteServiceProvider {
  baseUrl:string = "http://dtcmfeedback.digitalpico.com/Rest/";
  constructor() {
    console.log('Hello RemoteServiceProvider Provider');
  }

}
