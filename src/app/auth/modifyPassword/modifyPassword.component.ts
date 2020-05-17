import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  styleUrls: ['./modifyPassword.component.css'],
  templateUrl: './modifyPassword.component.html'
})

export class ModifyPasswordComponent implements OnInit, OnDestroy {

  isLoading = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
  onSignup(form: NgForm) {
    if (form.invalid) { return; }
    this.isLoading = true;
    this.authService.updatePassword(form.value.email ,form.value.password)
  }
}
