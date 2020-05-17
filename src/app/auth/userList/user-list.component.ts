import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthData } from '../auth-data.model'
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent implements OnInit {
  users: AuthData[] = [];
  private authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getAllUsers();
    this.authSub = this.authService.getUsersUpdateListener()
    .subscribe(
      (postData: {users: AuthData[], usersCount: number}) =>  {
        this.users = postData.users;
      }
    );
  }

  onDelete(email: string) {
    this.authService.deleteUser(email).subscribe( () => {
      this.ngOnInit()
    });
  }

}
