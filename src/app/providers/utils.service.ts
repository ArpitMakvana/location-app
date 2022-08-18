
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  loaderToShow: any;

  constructor(public loadingController: LoadingController,
              public toastController: ToastController) { }


    async presentToast(msg) {
      const toast = await this.toastController.create({
          message: msg,
          duration: 4000,
          cssClass:'customToastMessage',
          position: 'top'
      });
      toast.present();
  }

  showLoader() {
      this.loaderToShow = this.loadingController.create({
          message: 'Processing Server Request'
      }).then((res) => {
          res.present();
          res.onDidDismiss().then((dis) => {
              console.log('Loading dismissed!');
          });
      });
      // this.hideLoader();
  }

  hideLoader() {
      setTimeout(()=>{ 
          this.loadingController.dismiss();
      },500)
  }
}
