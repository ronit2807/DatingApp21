import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getMembers(){
    return this.httpClient.get<Member[]>("https://localhost:5001/api/users");
  }

  getMember(username: string){
    return this.httpClient.get<Member>(this.baseUrl +'users/'+username);
  }
}
