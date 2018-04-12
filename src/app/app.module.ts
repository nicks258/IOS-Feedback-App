import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LongPressModule } from 'ionic-long-press';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicStorageModule} from "@ionic/storage";
import { SQLite} from "@ionic-native/sqlite";
import { SQLitePorter} from "@ionic-native/sqlite-porter";
import { DatabaseProvider } from '../providers/database/database';
import {HttpModule} from "@angular/http";
import {QuestionsTablePage} from "../pages/questions-table/questions-table";
import {FirstPage} from "../pages/first/first";
import {ParticipantListPage} from "../pages/participant-list/participant-list";
import {ThankyouPage} from "../pages/thankyou/thankyou";
import {OptionPage} from "../pages/option/option";
import {AuthPage} from "../pages/auth/auth";
import {OptionsPage} from "../pages/options/options";
import {AuthPageModule} from "../pages/auth/auth.module";
import {CopartsListPage} from "../pages/coparts-list/coparts-list";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FirstPage,
    ParticipantListPage,
    QuestionsTablePage,
    OptionPage,
    OptionsPage,
    CopartsListPage,
    ThankyouPage,
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpModule,
    AuthPageModule,
    LongPressModule,
    IonicModule.forRoot(MyApp,{scrollAssist:false,
      autoFocusAssist:false}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ParticipantListPage,
    FirstPage,
    CopartsListPage,
    OptionsPage,
    AuthPage,
    OptionPage,
    QuestionsTablePage,
    ThankyouPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpModule,
    ScreenOrientation,
    SQLitePorter,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider
  ]
})
export class AppModule {}
