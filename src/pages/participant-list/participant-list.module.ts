import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParticipantListPage } from './participant-list';

@NgModule({
  declarations: [
    ParticipantListPage,
  ],
  imports: [
    IonicPageModule.forChild(ParticipantListPage),
  ],
})
export class ParticipantListPageModule {}
