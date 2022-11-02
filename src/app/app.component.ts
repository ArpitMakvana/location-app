import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './providers/user-data';
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@awesome-cordova-plugins/background-geolocation/ngx';
import {LoadingController ,AlertController ,ModalController ,NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Attendance',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Assignments',
      url: '/app/tabs/speakers',
      icon: 'list'
    },
    {
      title: 'Check-in/Check-out',
      url: '/app/tabs/map',
      icon: 'map'
    },
    // {
    //   title: 'About',
    //   url: '/app/tabs/about',
    //   icon: 'information-circle'
    // }
  ];
  loggedIn = false;
  dark = false;
  useData:any={};

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public alertController: AlertController,
    // private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    await this.storage.create();
    this.checkLoginStatus();
    this.listenForLoginEvents();
  }

  initializeApp() {
    let me=this;
    this.platform.ready().then(async() => {
      
      if (this.platform.is('hybrid')) {
      } 
      if(this.platform.is('cordova')){
        this.platform.backButton.subscribe(() => {
            let view = this.router.url;
            let baseViews=['/app/tabs/map','/app/tabs/schedule','/app/tabs/speakers','/login'];
            if(baseViews.indexOf(view)!=-1){
                // if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                // }else{
                //   this.lastTimeBackPress = new Date().getTime();
                //   this.util.errorToast(this.util.getTranslate('Press again to exit'));
                // }
                me.confirmExitApp();
            }
            console.log('this.view',view);
            this.navCtrl.pop();
        });
    }
    });
  }

  confirmExitApp(){
    let me=this;
    this.alertController.create({
      message     : '<p> Are you sure want to exit from app?</p>',
      cssClass    : 'my-custom-popup',
      mode        : 'ios',
      buttons     : [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Exit',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    }).then(alert =>{alert.present();});
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      this.userData.getUserData().then((userData) => {
        this.useData=JSON.parse(userData);
        console.log(this.useData);
      });
      this.loggedIn = loggedIn;
      // return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
      this.checkLoginStatus();
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
      this.useData={};
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/login');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
