import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'A Dating App';
  users: any;
  constructor(private httpClient:HttpClient){}
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.httpClient.get('https://localhost:5001/api/users').subscribe(response =>{
      this.users = response;
      console.log(this.users);
    }, error => {
      console.log(error);
    })
  }
}
