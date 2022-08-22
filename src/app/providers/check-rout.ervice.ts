import { Injectable } from '@angular/core';
import { CanLoad,CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserData } from './user-data';
@Injectable({
  providedIn: 'root'
})
export class CheckRoute implements CanActivate {
  constructor(private storage: Storage, private router: Router,
    private userData: UserData,) { }

    canActivate() {
    return this.userData.isLoggedIn().then(loggedIn => {
        console.log(loggedIn);
      if (loggedIn) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
