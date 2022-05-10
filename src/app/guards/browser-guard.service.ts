import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import * as Platform from "platform";

@Injectable({
  providedIn: 'root'
})
export class BrowserGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let compatible: boolean = true;
    if(!this.getBrowserCompatible()) {
      this.router.navigate(["/browser_error"]);
      compatible = false;
    }
    return compatible;
  }

  getBrowserCompatible(): boolean {
    let isCompatible = false;
    let compatibleBrowsers = new Set<string>(["chrome", "firefox", "safari"]);
    console.log(Platform.name.toLowerCase().split(" ")[0]);
    let name = Platform.name.toLowerCase().split(" ")[0];
    if(name == undefined) {
      name = "other";
    }
    isCompatible = compatibleBrowsers.has(name);
    return isCompatible;
  }
}
