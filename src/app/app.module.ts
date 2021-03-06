import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { JitCompiler } from '@angular/compiler';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicStorageModule } from '@ionic/storage';
import { TepuyModule } from '../tepuy-angular/tepuy.module';
import { NgPipesModule } from 'ngx-pipes';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
//import { NativeAudio } from '@ionic-native/native-audio';
//import { StreamingMedia } from '@ionic-native/streaming-media';
//import { File } from '@ionic-native/file';
//import { VideoPlayer } from '@ionic-native/video-player';
//import { TextToSpeech } from '@ionic-native/text-to-speech';
//import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

import { MyApp } from './app.component';

import { HomePage, ConfigPopover } from '../pages/home/home';
import { GamePage } from '../pages/game/game';
import { GameLevelPage } from '../pages/game/game-level';
import { GameChallengePage } from '../pages/game/game-challenge';
import { ContentPage } from '../pages/content/content';
import { ProgressPage } from '../pages/progress/progress';
import { AboutPage } from '../pages/about/about';
import { SignPage } from '../pages/sign/sign';
import { ConfigPage } from '../pages/config/config';
import { ErrorsPage } from '../pages/errors/errors';
import { ErrorDetailComponent } from '../pages/errors/error-detail';

import { VideoPlayerComponent } from '../components/video-player/video-player';
import { CompileDirective } from '../directives/compile.directive';

import { ContentProvider } from '../providers/content';
import { GameDataProvider } from '../providers/game-data';
import { AppConfigProvider } from '../providers/app-config';
import { AppDataProvider } from '../providers/app-data';
import { RemoteDataProvider } from '../providers/remote-data';
import { MediaPlayer } from '../providers/media-player';
import { MediaCatalog } from '../providers/media-player.catalog';
import { CustomErrorHandler } from '../providers/custom-error.handler';

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
    AboutPage,
    SignPage,
    ConfigPage,
    VideoPlayerComponent,
    ErrorsPage,
    ErrorDetailComponent,
    ConfigPopover
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TepuyModule,
    NgPipesModule,
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
    AboutPage,
    SignPage,
    ConfigPage,
    VideoPlayerComponent,
    ErrorsPage,
    ErrorDetailComponent,
    ConfigPopover
  ],
  providers: [
    StatusBar,
    AndroidFullScreen,
    SplashScreen,
    MobileAccessibility,
    UniqueDeviceID,
    Device,
    Network,
    //NativeAudio,
    //StreamingMedia,
    //VideoPlayer,
    //TextToSpeech,
    //MobileAccessibility,
    //File,
    {provide: ErrorHandler, useClass: CustomErrorHandler },
    //{provide: Compiler, useClass: JitCompiler},
    ContentProvider,    
    GameDataProvider,
    AppConfigProvider,
    AppDataProvider,
    RemoteDataProvider,
    MediaPlayer,
    MediaCatalog
  ]
})
export class AppModule {}
