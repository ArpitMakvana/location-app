import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';
import { RestService } from '../../providers/rest.service';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  username: string;
  userDetails:any={};
  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData,
    public restApi:RestService
  ) { }

  ngAfterViewInit() {
    this.getUserData();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  async changeUsername() {
    const alert = await this.alertCtrl.create({
      header: 'Change Username',
      buttons: [
        'Cancel',
        {
          text: 'Ok',
          handler: (data: any) => {
            // this.userData.setUserData(data.username);
            this.getUserData();
          }
        }
      ],
      inputs: [
        {
          type: 'text',
          name: 'username',
          value: this.username,
          placeholder: 'username'
        }
      ]
    });
    await alert.present();
  }

  getUserData() {
    this.userData.getUserData().then((userData) => {
      let data=JSON.parse(userData);
      console.log(data);
      this.username = data.staff_name;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
  }

  logout() {
    this.userData.logout().then(res=>{
      this.router.navigateByUrl('/login');
    });
  }

  support() {
    this.router.navigateByUrl('/support');
  }
}
