import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { RestService } from '../../providers/rest.service';
import { UtilsService } from '../../providers/utils.service';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';
  jobDetails:any={};
  allComments:Array<any>=[];
  displayAddComment:boolean=false;
  inputComment:any='';
  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private utils:UtilsService,
    public restApi:RestService
  ) { 
    console.log(this.route.snapshot.paramMap.get('sessionId'))
  }

  ionViewWillEnter() {
    this.route.params.subscribe((res)=>{
      console.log(res);
      this.jobDetails=res;
      this.getWorkComment(res.project_id);
    })
    // this.dataProvider.load().subscribe((data: any) => {
    //   if (data && data.schedule && data.schedule[0] && data.schedule[0].groups) {
    //     const sessionId = this.route.snapshot.paramMap.get('sessionId');
    //     for (const group of data.schedule[0].groups) {
    //       if (group && group.sessions) {
    //         for (const session of group.sessions) {
    //           if (session && session.id === sessionId) {
    //             this.session = session;

    //             this.isFavorite = this.userProvider.hasFavorite(
    //               this.session.name
    //             );

    //             break;
    //           }
    //         }
    //       }
    //     }
    //   }
    // });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/map`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.userProvider.hasFavorite(this.session.name)) {
      this.userProvider.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }
  getWorkComment(workId){
    this.restApi.getRequest('/getjobwork/'+workId).subscribe(res=>{
      console.log('res',res);
      if(res.status){
        this.allComments=res.response||[];
        
      }else{
        // this.utils.presentToast(res.message);
      }
    })

  }

  addComment(){
    this.displayAddComment= !this.displayAddComment;  
  }

  markAsComplete(){

  }
  submitComment(){
    if(this.inputComment.legth <5){
      this.utils.presentToast('Please enter valid comment');
      return false;
    }
    let data={
      client_id:this.jobDetails.client_id,
      staff_id:this.jobDetails.staff_id,
      project_id:this.jobDetails.project_id,
      work_desc:this.inputComment,
      work_date: new Date()
    }
    this.restApi.postRequest(data,'/addwork').subscribe(res=>{
      if(res.status){
        this.displayAddComment=false;
        this.getWorkComment(this.jobDetails.project_id);
      }
      this.utils.presentToast(res.message);
    })
  }
}
