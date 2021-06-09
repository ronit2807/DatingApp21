import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  constructor(private accountService: AccountService,
    private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser$ = this.accountService.currentUser$;
  }

  OnSubmit(form: NgForm){
    this.accountService.login(this.model).subscribe(response =>{
      console.log(response);
      this.router.navigate(['/members']);
    },error =>{
      console.log(error);
      this.toastr.error(error.message);
    })
  }

  logout(){
    
    this.accountService.logout();
    this.router.navigateByUrl('');
  }

}
