import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-test',
  templateUrl: './error-test.component.html',
  styleUrls: ['./error-test.component.css']
})
export class ErrorTestComponent implements OnInit {

  baseUrl = 'https://localhost:5001/api/buggy/';
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.httpClient.get(this.baseUrl+'not-found').subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get400Error(){
    this.httpClient.get(this.baseUrl+'bad-request').subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get500Error(){
    this.httpClient.get(this.baseUrl+'server-error').subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get401Error(){
    this.httpClient.get(this.baseUrl+'auth').subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
    })
  }

  get400ValidationError(){
    this.httpClient.get(this.baseUrl+'not-found').subscribe(response =>{
      console.log(response);
    },error => {
      console.log(error);
    })
  }




}
