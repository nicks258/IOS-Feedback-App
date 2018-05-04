import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Printer } from '@ionic-native/printer';
import { LongPressModule } from 'ionic-long-press';
import { Network } from '@ionic-native/network';

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
import { Screenshot } from '@ionic-native/screenshot';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import {OptionsPage} from "../pages/options/options";
import {AuthPageModule} from "../pages/auth/auth.module";
import {CopartsListPage} from "../pages/coparts-list/coparts-list";
import { Device } from '@ionic-native/device';
// import {}  from "@ionic-native/core"
import {ViewRecordsPage} from "../pages/view-records/view-records";
import {ServerChangePage} from "../pages/server-change/server-change";
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import { HttpClient } from '@angular/common/http';
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
    ServerChangePage,
    ThankyouPage,
    ViewRecordsPage,
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
    ServerChangePage,
    OptionPage,
    ViewRecordsPage,
    QuestionsTablePage,
    ThankyouPage,
  ],
  providers: [
    StatusBar,
    Screenshot,
    SplashScreen,
    HttpModule,
    ScreenOrientation,
    SQLitePorter,
    Printer,
    Network,
    SQLite,
    HttpClient,
    File,
    Device,
    FileOpener,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    RemoteServiceProvider
  ]
})
export class AppModule {}
