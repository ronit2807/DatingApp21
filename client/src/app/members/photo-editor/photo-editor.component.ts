import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { AppUser } from 'src/app/_model/AppUser';
import { Member } from 'src/app/_model/Member';
import { Photo } from 'src/app/_model/photo';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;
  uploader:FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl=environment.apiUrl;
  user: AppUser;

  constructor(private accountService: AccountService,private memberService:MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.initUpload();
  }

  initUpload(){
    this.uploader = new FileUploader({
      url: this.baseUrl+'users/add-photo',
      authToken: 'Bearer '+this.user.token,
      isHTML5: true,
      allowedFileType: ["image"],
      removeAfterUpload:true,
      autoUpload: false,
      maxFileSize: 10*1024*1024

    });

    this.uploader.onAfterAddingFile = file =>{
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item,response,status,headers)=>{
      const photo= JSON.parse(response);
      this.member.photos.push(photo);
    }
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(()=>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p=>{
        if(p.isMain) p.isMain=false;
        if(p.id === photo.id) p.isMain=true;
      })
    })
  }

  deletePhoto(photo: Photo){
    this.memberService.deletePhoto(photo.id).subscribe(()=>{
      this.member.photos.splice(this.member.photos.indexOf(photo))
    });
  }

}
