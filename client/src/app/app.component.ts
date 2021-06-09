import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppUser } from './_model/AppUser';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'A Dating App';
  users: any;
  constructor(private httpClient:HttpClient,private accountService: AccountService){}
  ngOnInit(): void {
    //this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user:AppUser = JSON.parse(localStorage.getItem('AppUser'));
    this.accountService.setCurrentUser(user);
  }

  // getUsers(){
  //   this.httpClient.get('https://localhost:5001/api/users').subscribe(response =>{
  //     this.users = response;
  //     console.log(this.users);
  //   }, error => {
  //     console.log(error);
  //   })
  // }
}
