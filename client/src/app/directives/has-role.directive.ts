import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { AppUser } from '../_model/AppUser';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {

  @Input() appHasRole: string[];
  user: AppUser;
  constructor(private viewContainerRef:ViewContainerRef,private templateRef:TemplateRef<any>,private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      userData => {
        this.user = userData;
      }
    )
   }
  ngOnInit(): void {
    if(!this.user.roles || this.user === null){
      this.viewContainerRef.clear();
    }
    
    if(this.user.roles.some(r => this.appHasRole.includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

}