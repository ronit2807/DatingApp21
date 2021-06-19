import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppUser } from '../_model/AppUser';
import { Member } from '../_model/Member';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl=environment.apiUrl;
  constructor(private http:HttpClient) {}

  getUserWithRole(){
    return this.http.get<Partial<AppUser[]>>(this.baseUrl+'admin/users-with-roles');
  }

  updateUserRoles(username: string,roles: string[]){
    return this.http.post(this.baseUrl+'admin/edit-roles/'+username+'?roles='+roles,{});
  }
}
