import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private httpClient: HttpClient) { }

  getMembers(){
    if(this.members.length > 0) return of (this.members);
    return this.httpClient.get<Member[]>("https://localhost:5001/api/users").pipe(
      map(members => {
        this.members = members; 
        return members;
      })
    )
  }

  getMember(username: string){
    const member = this.members.find(x => x.userName ===username);
    if(member !== undefined) return of (member);
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
}
