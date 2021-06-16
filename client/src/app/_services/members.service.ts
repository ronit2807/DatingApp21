import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { combineAll, map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_model/AppUser';
import { Member } from '../_model/Member';
import { PaginatedResult, PaginatedResult2 } from '../_model/Pagination';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();
  paginatedResult2: PaginatedResult2<Member[]>;
  memberCache = new Map();
  pageNumber=1;
  pageSize=5;
  minAge=18;
  maxAge=100;
  gender: string;
  orderBy: string = 'lastActive';
  user: AppUser;


  constructor(private httpClient: HttpClient,private accountService:AccountService) {
   // this.gender = this.accountService.user.gender ==='male'?'female':'male'
   this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
     this.user = user;
   });

   this.gender = this.gender = this.user.gender ==='male'?'female':'male';
   }

  getMembers(page?: number,itemsPerPage?: number,gender?: string,minAge?: number,maxAge?: number,orderBy? :string){
    // if(this.members.length > 0) return of (this.members);
    // return this.httpClient.get<Member[]>("https://localhost:5001/api/users").pipe(
    //   map(members => {
    //     this.members = members; 
    //     return members;
    //   })
    // )
    
     const key = page+'-'+itemsPerPage+'-'+gender+'-'+minAge+'-'+maxAge+'-'+orderBy;
    var response = this.memberCache.get(key);
    if(response != null){
      
      return of (response);
    }

    let params = new HttpParams();
    if(page != null && itemsPerPage != null){
      params = params.append("pageNumber",page.toString());
      params = params.append("pageSize",itemsPerPage.toString());
      params = params.append("gender",gender);
      params = params.append("minAge",minAge.toString());
      params = params.append("maxAge",maxAge.toString());
      params = params.append("orderBy",orderBy);
    }
    return this.httpClient.get<Member[]>("https://localhost:5001/api/users",{ observe: 'response',params}).pipe(
      map(response =>{
        this.paginatedResult.result = response.body;
        if(response.headers.get('Pagination')){
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        this.paginatedResult2 = new PaginatedResult2(this.paginatedResult.result,this.paginatedResult.pagination)
        this.memberCache.set(key,this.paginatedResult2)
        
        return this.paginatedResult;
      })    
    )
  }

  getMember(username: string){
    // const member = this.members.find(x => x.userName ===username);
    // if(member !== undefined) return of (member);
   const member = [...this.memberCache.values()].
   reduce((arr,elem)=> arr.concat(elem.result),[]).
   find((member:Member)=> member.userName === username);

   if(member != null){
     return of (member);
   }
   
    return this.httpClient.get<Member>(this.baseUrl +'users/'+username);
  }

  updateMember(member: Member){
    return this.httpClient.put(this.baseUrl+'users',member).pipe(
      map(()=>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number){
    return this.httpClient.put(this.baseUrl+'users/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId:number){
    return this.httpClient.delete(this.baseUrl+'users/delete-photo/'+photoId);
  }

  addLike(username: string){
    return this.httpClient.post(this.baseUrl+'likes/'+username,{});
  }

  getLikes(predicate: string,pageNumber: number,pageSize: number){
    let params = new HttpParams();
    params = params.append("predicate",predicate);
    params = params.append("pageNumber",pageNumber.toString());
    params = params.append("pageSize",pageSize.toString());
    return this.httpClient.get<Partial<Member[]>>(this.baseUrl+'likes',{observe: 'response', params}).pipe(
      map(response =>{
        this.paginatedResult.result = response.body;
        if(response.headers.get('Pagination')){
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return this.paginatedResult;
      })    
    )
  }
}
