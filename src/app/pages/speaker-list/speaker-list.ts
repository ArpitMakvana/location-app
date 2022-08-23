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
  segment='Accepted';
  incomingJob:Array<any>=[];
  completedJob:Array<any>=[];
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
      // this.getIncomingJob(this.useData.staff_id);
      this.getAcceptedJobs(this.useData.staff_id)
    });
  }
  getIncomingJob(staffId){
    this.restApi.getRequest('/incomework/'+staffId).subscribe(res=>{
      console.log('res',res);
      if(res.status){
        this.incomingJob=res.response||[];
      }else{
        this.incomingJob=[]
        this.utils.presentToast(res.message);
      }
    })
  }
  getCompletedJob(staffId){
    this.restApi.getRequest('/completedjob/'+staffId).subscribe(res=>{
      console.log('res',res);
      if(res.status){
        this.completedJob=res.response||[];
      }else{
        this.completedJob=[];
        this.utils.presentToast(res.message);
      }
    })
  }

  getAcceptedJobs(staffId){
    this.restApi.getRequest('/receivejob/'+staffId).subscribe(res=>{
      console.log('res',res);
      if(res.status){
        this.jobList=res.response||[];
      }else{
        this.jobList=[]
        this.utils.presentToast(res.message);
      }
    })
    
  }
  updateSchedule(){
    console.log(this.segment);
    if(this.segment=='Accepted'){
      this.getAcceptedJobs(this.useData.staff_id);
    }else if(this.segment=='incoming'){
      this.getIncomingJob(this.useData.staff_id);
    }else if(this.segment=='Complete'){
      this.getCompletedJob(this.useData.staff_id);
    }
  }
  acceptJob(job){
    this.utils.presentAlertConfirm('Want to accept this Job',res=>{
      if(res){
        let data={
          client_id:job.client_id,
          staff_id:job.staff_id,
          project_id:job.project_id
        }
        this.restApi.postRequest(data,'/acceptwork').subscribe(res=>{
          console.log('res',res);
          if(res.status){
            this.getIncomingJob(this.useData.staff_id);
          }
            this.utils.presentAlert(res.message);
        })
      }
    })
  }
  openDetails(job){
    this.router.navigate(['/app/tabs/speakers/session/'+job.project_id,job]);
  }
}
