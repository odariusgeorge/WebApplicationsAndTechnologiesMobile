import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-create/post-list/post-list.component';
import { PostListSellingComponent } from './posts/post-create/post-list-selling/post-list-selling.component';
import { PostListBuyingComponent } from './posts/post-create/post-list-buying/post-list-buying.component';
import { PostListExpiredComponent } from './posts/post-create/post-list-expired/post-list-expired.component';
import { PostCreateComponent } from './posts/post-create/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostMessagesComponent } from './posts/post-create/post-messages/post-messages.component';
import { PostBidComponent } from './posts/post-create/post-bid/post-bid.component';
import { CreateModeratorComponent } from './auth/createModerator/createModerator.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { ModifyPasswordComponent } from './auth/modifyPassword/modifyPassword.component';
import { PostListWonComponent } from './posts/post-create/post-list-won/post-list-won.component';
import { PostBuyComponent } from './posts/post-create/post-buy/post-buy.component';
import { PostListBoughtComponent } from './posts/post-create/post-list-bought/post-list-bought.component';
import { PostListSoldComponent } from './posts/post-create/post-list-sold/post-list-sold.component'
import { UserListComponent} from './auth/userList/user-list.component';



const routes: Routes = [
  {
    path: '', redirectTo: 'postList', pathMatch: 'full'
  },
  {
    path: 'postList', component: PostListComponent
  },
  {
    path: 'userList', component: UserListComponent, canActivate: [AdminGuard]
  },
  {
    path: 'postListSelling', component: PostListSellingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'postListBuying', component: PostListBuyingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'postListWon', component: PostListWonComponent, canActivate: [AuthGuard]
  },
  {
    path: 'createPost', component: PostCreateComponent, canActivate: [AuthGuard]
  },
  {
    path: 'postListExpired', component: PostListExpiredComponent, canActivate: [AdminGuard]
  },
  {
    path: 'postListSold', component: PostListSoldComponent, canActivate: [AdminGuard]
  },
  {
    path: 'postListBought', component: PostListBoughtComponent, canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId', component: PostCreateComponent, canActivate: [AdminGuard]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'signup', component: SignupComponent
  },
  {
    path: 'createModerator', component: CreateModeratorComponent, canActivate: [AdminGuard]
  },
  {
    path: 'modifyPassword', component: ModifyPasswordComponent
  },
  {
    path: 'message/:postId', component: PostMessagesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'bid/:postId', component: PostBidComponent, canActivate: [AuthGuard]
  },
  {
    path: 'buy/:postId', component: PostBuyComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})

export class AppRoutingModule { }
