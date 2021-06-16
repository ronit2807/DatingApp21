import { Component, OnInit } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { retryWhen, take } from 'rxjs/operators';
import { AppUser } from 'src/app/_model/AppUser';
import { Member } from 'src/app/_model/Member';
import { Pagination } from 'src/app/_model/Pagination';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  pageNumber=1;
  pageSize=5;
  minAge=18;
  maxAge=100;
  gender: string;
  currentUser$: Observable<AppUser>;
  user: AppUser;
  genders = [{value:'male',display:'Males'},{value: 'female',display:'Females'}]
  orderBy: string = 'lastActive';

  constructor(private memberService:MembersService,private accountService: AccountService) {
    this.pageNumber = this.memberService.pageNumber;
    this.pageSize = this.memberService.pageSize;
    this.minAge = this.memberService.minAge;
    this.maxAge = this.memberService.maxAge;
    this.gender = this.memberService.gender;
    this.orderBy = this.memberService.orderBy;
   }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
    });
    
    
    this.loadMembers();

  }

  loadMembers(){
    this.memberService.pageNumber = this.pageNumber;
    this.memberService.pageSize = this.pageSize;
    this.memberService.minAge = this.minAge;
    this.memberService.maxAge = this.maxAge;
    this.memberService.gender = this.gender;
    this.memberService.orderBy = this.orderBy;

    this.memberService.getMembers(this.pageNumber,this.pageSize,this.gender,this.minAge,this.maxAge,this.orderBy).subscribe(
      response =>{
        this.members = response.result;
        this.pagination = response.pagination;
        
      }
    )
  }

  pageChanged(event: any){
    this.memberService.pageNumber = this.pageNumber;
    this.memberService.pageSize = this.pageSize;
    this.memberService.minAge = this.minAge;
    this.memberService.maxAge = this.maxAge;
    this.memberService.gender = this.gender;
    this.memberService.orderBy = this.orderBy;
    this.pageNumber = event.page;
    this.loadMembers();
  }

  ResetFilters(){
    this.pageNumber=1;
    this.pageSize=5;
    this.minAge=18;
    this.maxAge=100;
    this.gender = this.user.gender ==='male'?'female':'male';
    this.orderBy = 'lastActive';

    this.loadMembers();
  }

  onSubmit(){
    console.log(this.gender);
  }

  // loadMembers(){
  //   this.memberService.getMembers().subscribe(response=>{
  //     console.log(response);
  //     this.members = response;
  //   });
  // }

}
