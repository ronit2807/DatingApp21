import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { AppUser } from '../_model/AppUser';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  currentUserSource = new ReplaySubject<AppUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  login(model: any){
    console.log(model.password);
    return this.http.post('https://localhost:5001/api/account/login',{
      "username": model.username,
      "password": model.password
    }).pipe(
      map((userData: AppUser)=>{
        if(userData){
          localStorage.setItem('AppUser',JSON.stringify(userData));
          this.currentUserSource.next(userData);
        }
        
      })
    )
  }

  register(model: any){
    return this.http.post('https://localhost:5001/api/account/register',{
      "username": model.username,
      "password": model.password
    }).pipe(
      map((userData: AppUser)=>{
        if(userData){
          localStorage.setItem('AppUser',JSON.stringify(userData));
          this.currentUserSource.next(userData);
        }
        return userData;
        
      })
    )
  }

  setCurrentUser(user: AppUser){
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('AppUser');
    this.currentUserSource.next(null);
  }
}
