// import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// // import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { IonicModule } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage-angular';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// // import { ServiceWorkerModule } from '@angular/service-worker';
// import { environment } from '../environments/environment';
// import { FormsModule } from '@angular/forms';
// import { HttpConfigInterceptor } from './interceptor/httpConfig.interceptor';
// // import { SafePipe } from './pipes/safe.pipe';
// // import { BackgroundGeolocation } from '@awesome-cordova-plugins/background-geolocation/ngx';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpConfigInterceptor } from './interceptor/httpConfig.interceptor';
import { IonicStorageModule } from '@ionic/storage-angular';
// import { SafePipe } from './pipes/safe.pipe';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot({
    mode: 'ios'
}), 
AppRoutingModule,
HttpClientModule,
IonicStorageModule.forRoot(),
FormsModule,
],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpConfigInterceptor,
    multi: true
  },
  { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
],
  bootstrap: [AppComponent],
})

// @NgModule({
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     HttpClientModule,
//     FormsModule,
//     IonicModule.forRoot({
//       mode: 'ios'
//   }),
//     IonicStorageModule.forRoot(),
//     // ServiceWorkerModule.register('ngsw-worker.js', {
//     //   enabled: environment.production
//     // })
//   ],
//   declarations: [AppComponent],
//   providers: [
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: HttpConfigInterceptor,
//       multi: true
//     }
//   ],
//   bootstrap: [AppComponent]
// })
export class AppModule {}
