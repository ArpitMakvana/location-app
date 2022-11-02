
import { ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  loaderToShow: any;

  constructor(public loadingController: LoadingController,
              public toastController: ToastController,public alertController: AlertController) { }


    async presentToast(msg) {
      const toast = await this.toastController.create({
          message: msg,
          duration: 1000,
          cssClass:'customToastMessage',
          position: 'middle'
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
  async presentAlertConfirm(message,callBack:any) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            callBack(false);
          }
        }, {
          text: 'Okay',
          handler: () => {
            callBack( true);
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      backdropDismiss:true,
      buttons: ['OK']
    });

    await alert.present();
  }
}
