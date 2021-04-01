import {Injectable} from '@angular/core';

@Injectable()
export class NavigationService {

  public sidenav: any;

  constructor() {
  }

  public closeNav(): void {
    this.sidenav.close();
  }

  public openNav(): void {
    this.sidenav.open();
  }

  public toggleNav(): void {
    this.sidenav.toggle();
  }
}
