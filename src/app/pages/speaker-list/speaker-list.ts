import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';
import { RestService } from '../../providers/rest.service';
import { UtilsService } from '../../providers/utils.service';


@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage {
  speakers: any[] = [];
  useData:any={};
  jobList:Array<any>=[];
  constructor(public confData: ConferenceData,
    public router: Router,
    public userData: UserData,
    private utils:UtilsService,
    public restApi:RestService) {}

  ionViewDidEnter() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
    this.userData.getUserData().then((userData) => {
      this.useData=JSON.parse(userData);
      console.log(this.useData);
      this.getAllJobs(this.useData.staff_id);
    });
  }

  getAllJobs(staffId){
    this.restApi.getRequest('/alljobs/'+staffId).subscribe(res=>{
      console.log('res',res);
      if(res.status){
        this.jobList=res.response||[];
      }else{
        this.utils.presentToast(res.message);
      }
    })
    
  }
  openDetails(job){
    this.router.navigate(['/app/tabs/speakers/session/'+job.project_id,job]);
  }
}
