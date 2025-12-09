export interface MenuItem {
  label: string;
  route: string;
  icon?: string;
  subMenu?: SubMenuItem[];
}

export interface SubMenuItem {
  label: string;
  route: string;
  icon?: string;
}
