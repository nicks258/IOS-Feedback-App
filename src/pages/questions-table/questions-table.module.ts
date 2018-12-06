import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionsTablePage } from './questions-table';

@NgModule({
  declarations: [
    QuestionsTablePage,
  ],
  imports: [
    IonicPageModule.forChild(QuestionsTablePage),
  ],
})
export class QuestionsTablePageModule {}
