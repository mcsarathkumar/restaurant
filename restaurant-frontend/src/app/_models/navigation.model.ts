export interface NavItem {
  displayName: string;
  iconName?: string;
  route?: string;
  roleId?: number;
  shortcut?: string;
  children?: NavItem[];
}

export const navItemsAdmin: NavItem[] = [
  {
    displayName: 'Manage Reviews / Comments',
    iconName: 'rate_review',
    route: 'admin/reviews-comments',
  },
  {
    displayName: 'Manage Users',
    iconName: 'badge',
    route: 'admin/users',
  },
  {
    displayName: 'Manage Restaurants',
    iconName: 'room_service',
    route: 'admin/restaurant',
  }
];

export const navItemsOwner: NavItem[] = [
  {
    displayName: 'Clients Feedback',
    iconName: 'groups',
    route: 'home',
  },
  {
    displayName: 'Manage Restaurants',
    iconName: 'room_service',
    route: 'manage-restaurant',
  },
  {
    displayName: 'Create New Restaurant',
    iconName: 'add_location_alt',
    route: 'add-restaurant',
  }
];

