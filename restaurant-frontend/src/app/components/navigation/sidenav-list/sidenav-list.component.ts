import {Component, HostBinding, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {NavItem} from '../../../_models/navigation.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationService} from '../../../_services/navigation.service';
import {environment} from '../../../../environments/environment';
import {AppService} from '../../../_services/app.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidenavListComponent {

  expanded = false;
  isMobile: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(public router: Router,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
              private appService: AppService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.isMobile = environment.mobileApp;
  }

  onItemSelected(item: NavItem): void {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route], {relativeTo: this.route});
      this.navigationService.closeNav();
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
