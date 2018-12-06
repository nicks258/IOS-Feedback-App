import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerChangePage } from './server-change';

@NgModule({
  declarations: [
    ServerChangePage,
  ],
  imports: [
    IonicPageModule.forChild(ServerChangePage),
  ],
})
export class ServerChangePageModule {}
