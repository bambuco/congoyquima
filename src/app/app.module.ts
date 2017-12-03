import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicStorageModule } from '@ionic/storage';
import { TepuyModule } from 'tepuy-angular';


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
import { GameLevelPage } from '../pages/game/game-level';
import { ContentPage } from '../pages/content/content';
import { ProgressPage } from '../pages/progress/progress';

import { HelpComponent } from '../components/help/help';
import { VideoPlayerComponent } from '../components/video-player/video-player';

import { ContentProvider } from '../providers/content';
import { GameDataProvider } from '../providers/game-data';
import { MediaPlayer } from '../providers/media-player';

@NgModule({
  declarations: [
    MyApp,
    Splash,
    HomePage,
    GamePage,
    GameLevelPage,
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
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: GamePage, name: 'Game', segment: 'game-world' },
        { component: GameLevelPage, name: 'GameLevel', segment: 'game-level/:levelId' },
        { component: ContentPage, name: 'Contents', segment: 'contents' },
        { component: ProgressPage, name: 'Progress', segment: 'progress' }
      ]    
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Splash,
    HomePage,
    GamePage,
    GameLevelPage,
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
    GameDataProvider,
    MediaPlayer
  ]
})
export class AppModule {}
