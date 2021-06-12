import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorTestComponent } from './Errors/error-test/error-test.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {path:'members',component:MemberListComponent,canActivate: [AuthGuard]},
      {path:'members/:username',component: MemberDetailComponent},
      {path:'lists',component:ListsComponent},
      {path: 'messages',component: MessagesComponent}
    ]
  },
  {path:'errors',component:ErrorTestComponent},
  {path:'server-error',component:ServerErrorComponent},
  {path: 'not-found',component: NotFoundComponent},
  {path:'**',component:HomeComponent,pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
