import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { UserOptions } from '../../interfaces/user-options';
import {RestService} from '../../providers/rest.service'
import { UtilsService } from '../../providers/utils.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    private restApi:RestService,
    private utils:UtilsService,
    private iab: InAppBrowser
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.restApi.postRequest({'user_id':this.login.username,user_pass:this.login.password,device_token:''},'/login').subscribe(res=>{
        console.log(res);
        if(res.status){
          this.userData.login(res.response).then(()=>{
            this.router.navigateByUrl('/app/tabs/map');
          });
        }else{
          this.utils.presentToast(res.message);
        }
      },err=>{
        console.log(err);
      })
      // this.userData.login(this.login.username);
      // this.router.navigateByUrl('/app/tabs/schedule');
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
  openLink(){
    const browser = this.iab.create('https://dx.ezybilling.in/admin/login',
    '_self',
    {
      location: 'no',
      clearcache: 'yes',
      clearsessioncache: 'yes'
    });

      // browser.close();
  }
}
