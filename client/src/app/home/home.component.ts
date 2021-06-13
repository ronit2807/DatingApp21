import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  users: any;
  constructor(private httpClient:HttpClient) { }

  ngOnInit(): void {
   // this.getUsers();
  }

  toggleRegisterMode(){
    this.registerMode = !this.registerMode;
  }

  onRegister(){
    this.toggleRegisterMode();
  }

  getUsers(){
    this.httpClient.get('https://localhost:5001/api/users').subscribe(response =>{
      this.users = response;
      console.log(this.users);
    }, error => {
      console.log(error);
    })
  }

  onEmitCancel(event: boolean){
    this.registerMode = event;
  }

}
