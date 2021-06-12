import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { AppUser } from '../_model/AppUser';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  user: AppUser;
  constructor(private accountService: AccountService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user =>{
      this.user = user;
    })

    if(this.user){
      request = request.clone({
        setHeaders: {Authorization: 'Bearer '+this.user.token}
      })
    }
    return next.handle(request);
  }
}
