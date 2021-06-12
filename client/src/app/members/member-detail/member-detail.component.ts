import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_model/Member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService:MembersService,private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }];

      
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

  loadMember(){
    this.memberService.getMember(this.router.snapshot.paramMap.get('username').toString()).subscribe(member =>{
      this.member=member;
      this.galleryImages = this.getImages();
    });
  }

}
