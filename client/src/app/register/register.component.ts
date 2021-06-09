import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() emitCancelEvent=new  EventEmitter<boolean>();
  model: any = {};
  constructor(private accountService: AccountService,private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    console.log(this.model);
    this.accountService.register(this.model).subscribe(
      response => {
        console.log(response);
        this.onCancel();
      }
    ,error => {this.toastr.error(error.error);});
  }

  onCancel(){
    this.emitCancelEvent.emit(false);
  }

}
