import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { TepuyModule } from 'tepuy-angular';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { File } from '@ionic-native/file';
import { VideoPlayer } from '@ionic-native/video-player';

import { MyApp } from './app.component';
import { Splash } from './splash.component';

import { HomePage } from '../pages/home/home';
import { GamePage, GameSampleComponent } from '../pages/game/game';
import { ContentPage } from '../pages/content/content';
import { ProgressPage } from '../pages/progress/progress';

import { HelpComponent } from '../components/help/help';
import { VideoPlayerComponent } from '../components/video-player/video-player';

import { ContentProvider } from '../providers/content';
import { MediaPlayer } from '../providers/media-player';

@NgModule({
  declarations: [
    MyApp,
    Splash,
    HomePage,
    GamePage,
    ContentPage,
    ProgressPage,
    HelpComponent,
    VideoPlayerComponent,
    GameSampleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TepuyModule,
    IonicImageViewerModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Splash,
    HomePage,
    GamePage,
    ContentPage,
    ProgressPage,
    HelpComponent,
    VideoPlayerComponent,
    GameSampleComponent
  ],
  providers: [
    StatusBar,
    AndroidFullScreen,
    SplashScreen,
    StreamingMedia,
    VideoPlayer,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContentProvider,
    MediaPlayer
  ]
})
export class AppModule {}
