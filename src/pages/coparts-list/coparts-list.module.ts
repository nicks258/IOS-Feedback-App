import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopartsListPage } from './coparts-list';

@NgModule({
  declarations: [
    CopartsListPage,
  ],
  imports: [
    IonicPageModule.forChild(CopartsListPage),
  ],
})
export class CopartsListPageModule {}
