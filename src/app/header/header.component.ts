import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css' ]
})

export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService) { }

  userIsAuthenticated = false;
  userIsAdmin = false;
  private authListenerSubs: Subscription;
  title = "Books List"

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.getIsAdmin();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userIsAdmin = this.authService.getIsAdmin();
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
