import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicStorageModule } from '@ionic/storage';
import { TepuyModule } from '../tepuy-angular/tepuy.module';


import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { NativeAudio } from '@ionic-native/native-audio';
//import { StreamingMedia } from '@ionic-native/streaming-media';
//import { File } from '@ionic-native/file';
//import { VideoPlayer } from '@ionic-native/video-player';
//import { TextToSpeech } from '@ionic-native/text-to-speech';
//import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { GamePage } from '../pages/game/game';
import { GameLevelPage } from '../pages/game/game-level';
import { GameChallengePage } from '../pages/game/game-challenge';
import { ContentPage } from '../pages/content/content';
import { ProgressPage } from '../pages/progress/progress';

import { HelpComponent } from '../components/help/help';
import { VideoPlayerComponent } from '../components/video-player/video-player';
import { CompileDirective } from '../directives/compile.directive';

import { ContentProvider } from '../providers/content';
import { GameDataProvider } from '../providers/game-data';
import { AppDataProvider } from '../providers/app-data';
import { MediaPlayer } from '../providers/media-player';

@NgModule({
  declarations: [
    MyApp,
    CompileDirective,
    HomePage,
    GamePage,
    GameLevelPage,
    GameChallengePage,
    ContentPage,
    ProgressPage,
    HelpComponent,
    VideoPlayerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TepuyModule,
    IonicImageViewerModule,
    IonicStorageModule.forRoot({
        name: '__congoyquima'
    }),
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'home' },
        { component: GamePage, name: 'Game', segment: 'game-world' },
        { component: GameLevelPage, name: 'GameLevel', segment: 'game-level/:id' },
        { component: GameChallengePage, name: 'GameChallenge', segment: 'game-level/:levelId/challenge/:id' },
        { component: ContentPage, name: 'Contents', segment: 'contents' },
        { component: ProgressPage, name: 'Progress', segment: 'progress' }
      ]    
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    GameLevelPage,
    GameChallengePage,
    ContentPage,
    ProgressPage,
    HelpComponent,
    VideoPlayerComponent
  ],
  providers: [
    StatusBar,
    AndroidFullScreen,
    SplashScreen,
    NativeAudio,
    //StreamingMedia,
    //VideoPlayer,
    //TextToSpeech,
    //MobileAccessibility,
    //File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContentProvider,    
    GameDataProvider,
    AppDataProvider,
    MediaPlayer
  ]
})
export class AppModule {}
