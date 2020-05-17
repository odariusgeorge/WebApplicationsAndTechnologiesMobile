import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';;

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
    const isAdmin = this.authService.getIsAdmin();
    const isVerified = this.authService.getIsVerified();
    if(!isAdmin || !isVerified) {
      this.authService.logout();
      this.router.navigate(['/login'], {skipLocationChange: true});
    }
    return isAdmin;
  }

}
