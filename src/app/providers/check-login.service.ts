import { Injectable } from '@angular/core';
import { CanLoad, Router,CanActivate } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';
@Injectable({
  providedIn: 'root'
})
export class CheckLogin implements CanActivate {
  constructor(private storage: Storage, private router: Router,
    private userData: UserData,) { }

    canActivate() {
    return this.userData.isLoggedIn().then(loggedIn => {
      console.log(loggedIn)
      if (loggedIn) {
        this.router.navigate(['/app', 'tabs', 'map']);
        return false;
      } else {
        return true;
      }
    });
  }
}
