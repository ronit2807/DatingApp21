import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() emitCancelEvent=new  EventEmitter<boolean>();
  model: any = {};
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register(){
    console.log(this.model);
    this.accountService.register(this.model).subscribe(
      response => {
        console.log(response);
        this.onCancel();
      }
    );
  }

  onCancel(){
    this.emitCancelEvent.emit(false);
  }

}
