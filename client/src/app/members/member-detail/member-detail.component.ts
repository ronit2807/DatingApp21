import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_model/Member';
import { Message } from 'src/app/_model/Message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTab',{static: true}) memberTabs:TabsetComponent
  activeTab: TabDirective;
  messages: Message[] = [];
  constructor(private memberService:MembersService,private router: ActivatedRoute,private messageService:MessageService) { }
  

  ngOnInit(): void {
    this.router.data.subscribe(data => {
      this.member = data.member;
    })
    this.router.queryParams.subscribe(params =>{
      params.tab? this.selectTab(params.tab): this.selectTab(0);
    })

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }];

      this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    for(const image of this.member.photos){
      imageUrls.push({
        small: image?.url,
        medium: image?.url,
        big: image?.url
      });
    }

    return imageUrls;
  }

  // loadMember(){
  //   this.memberService.getMember(this.router.snapshot.paramMap.get('username').toString()).subscribe(member =>{
  //     this.member=member;
  //     this.galleryImages = this.getImages();
  //   });
  // }

  onTabActivate(tab: TabDirective){
    console.log(1);
    this.activeTab = tab;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.getMessageThread();
    }
  }

  getMessageThread(){
    console.log(this.member.userName)
    this.messageService.getMessageThread(this.member.userName).subscribe(response =>{
      this.messages = response;
    })
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }

}
