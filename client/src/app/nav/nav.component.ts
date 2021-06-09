import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppUser } from '../_model/AppUser';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {};
  currentUser$: Observable<AppUser>;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  OnSubmit(form: NgForm){
    this.accountService.login(this.model).subscribe(response =>{
      console.log(response);
    },error =>{
      console.log(error);
    })
  }

  logout(){
    
    this.accountService.logout();
  }

}
