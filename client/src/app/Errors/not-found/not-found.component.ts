import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  isLoggedIn = false;
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.currentUserSource.subscribe(user =>{
      if(user !== null){
        this.isLoggedIn = true;
      }
    })
  }

}
