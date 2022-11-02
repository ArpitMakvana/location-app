import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { RestService } from '../../providers/rest.service';
import { UtilsService } from '../../providers/utils.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { darkStyle } from './map-dark-style';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;
  currentStatus: any;
  useData: any;
  currentLatLong: any = {};
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform,
    public router: Router,
    public userData: UserData,
    private utils: UtilsService,
    private geolocation: Geolocation,
    public restApi: RestService) {
    this.userData.getUserData().then((userData) => {
      this.useData = JSON.parse(userData);
      this.getCurrentStatus(this.useData.staff_id)
    });
  }

  ionViewWillEnter() {
    this.userData.getUserData().then((userData) => {
      this.useData = JSON.parse(userData);
      this.getCurrentStatus(this.useData.staff_id)
    });
  }

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let isDark = false;
    let style = [];
    if (appEl.classList.contains('dark-theme')) {
      style = darkStyle;
    }

    const googleMaps = await getGoogleMaps(
      'AIzaSyCzvVn0_Z2pj3DtUswAEaGrL2ULIrv7rQs'
    );
    this.currentLatLong = await this.getChords();

    console.log('chordas', this.currentLatLong)

    let map;

    // this.confData.getMap().subscribe((mapData: any) => {
      // mapData[0].lat = this.currentLatLong.lat||mapData[0].lat;
      // mapData[0].lng = this.currentLatLong.lng || mapData[0].lng;
      // console.log('mapData', mapData, mapData.find((d: any) => d.center));
      const mapEle = this.mapElement.nativeElement;

      map = new googleMaps.Map(mapEle, {
        center: this.currentLatLong,
        zoom: 20,
        styles: style
      });

      var antennasCircle = new googleMaps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: this.currentLatLong,
        radius: 10
      });
      map.fitBounds(antennasCircle.getBounds());

      // mapData.forEach((markerData: any) => {
        const infoWindow = new googleMaps.InfoWindow({
          content: `<h5>${this.currentLatLong.name}</h5>`
        });

        const marker = new googleMaps.Marker({
          position: this.currentLatLong,
          map,
          title: this.currentLatLong.name
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      // });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    // });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const el = mutation.target as HTMLElement;
          isDark = el.classList.contains('dark-theme');
          if (map && isDark) {
            map.setOptions({ styles: darkStyle });
          } else if (map) {
            map.setOptions({ styles: [] });
          }
        }
      });
    });
    observer.observe(appEl, {
      attributes: true
    });

    console.log('points Are', this.arePointsNear({ "name": "My Work Place ", "lat": 22.9676, "lng": 76.0534, "center": true }, { "name": "My Work Place ", "lat": 22.7133, "lng": 75.8761, "center": true }, 1))
  }

  getCurrentStatus(data) {
    this.restApi.postRequest({ staff_id: data }, '/checkattend').subscribe(res => {
      this.currentStatus = res.status;
      this.utils.presentToast(res.message);
    })
  }
  checkIn() {
    let data = {
      client_id: this.useData.client_id,
      staff_id: this.useData.staff_id,
      attend_long: this.currentLatLong.lng,
      attend_lat: this.currentLatLong.lat,
      status: 'Check In'
    }
    this.restApi.postRequest(data, '/staffattend').subscribe(res => {
      if (res.status) {
        this.currentStatus = true;
      }
      // this.currentStatus=res.status;
      this.utils.presentToast(res.message);
    })
  }
  checkOut() {
    let data = {
      client_id: this.useData.client_id,
      staff_id: this.useData.staff_id,
      attend_long: this.currentLatLong.lng,
      attend_lat: this.currentLatLong.lat,
      status: 'Check Out'
    }
    this.restApi.postRequest(data, '/staffattend').subscribe(res => {
      // this.currentStatus=res.status;
      if (res.status) {
        this.currentStatus = false;
      }
      this.utils.presentToast(res.message);
    })
  }
  arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
  }

  getChords(): Promise<any> {
    return new Promise((resolve, reject) => {
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(showPosition, showError);
      // }
      // function showError(e) {
      //   alert(e)
      //   reject(e);
      // }
  
      // function showPosition(position) {
      //   var lat = position.coords.latitude;
      //   var lng = position.coords.longitude;
      //   resolve({ lat, lng })
      // }
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        resolve({ lat:resp.coords.latitude, lng:resp.coords.longitude })
       }).catch((error) => {
         console.log('Error getting location', error);
       });
    })
  
  
    // var showPosition=function( position ) {
    //     var lat = position.coords.latitude;
    //     var long =  position.coords.longitude;
    //     console.log('curentLat -long0',lat,long)
    //     // var latlng=new google.maps.LatLng(lat,long);
  
    //     // var map = new google.maps.Map( document.getElementById('map'), {
    //     //     center: latlng,
    //     //     zoom: 12
    //     // });
    // }
  }
}



function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}



