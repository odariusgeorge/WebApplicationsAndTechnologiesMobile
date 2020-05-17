import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  styleUrls: ['./createModerator.component.css'],
  templateUrl: './createModerator.component.html'
})

export class CreateModeratorComponent implements OnInit, OnDestroy {

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
    this.authService.createModerator(form.value.email ,form.value.password)
  }
}
