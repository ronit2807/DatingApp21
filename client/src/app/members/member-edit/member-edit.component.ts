import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { AppUser } from 'src/app/_model/AppUser';
import { Member } from 'src/app/_model/Member';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member: Member;
  user: AppUser;
  @ViewChild('editForm') editForm:NgForm; 
  @HostListener('window:beforeunload',['$event']) unloadNotofication($event: any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  constructor(private accountService: AccountService,
    private membersService: MembersService,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    this.membersService.getMember(this.user.username).subscribe(member => this.member = member);
  }

  onSubmit(){
    this.membersService.updateMember(this.member).subscribe(()=>{
      this.toastr.success("Profile updated.");
      this.editForm.reset(this.member);
    })
    
  }

}
