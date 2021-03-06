import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { ErrorTestComponent } from './Errors/error-test/error-test.component';
import { NotFoundComponent } from './Errors/not-found/not-found.component';
import { ServerErrorComponent } from './Errors/server-error/server-error.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailResolver } from './_resolvers/member-detailed.resolver';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {
    path: '',
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {path:'members',component:MemberListComponent,canActivate: [AuthGuard]},
      {path:'members/:username',component: MemberDetailComponent, resolve: {member: MemberDetailResolver}},
      {path:'member/edit',component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard]},
      {path:'lists',component:ListsComponent},
      {path: 'messages',component: MessagesComponent},
      {path: 'admin',component: AdminPanelComponent, canActivate: [AdminGuard]}
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
