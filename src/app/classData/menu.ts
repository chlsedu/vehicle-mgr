export class Menu {
  path: string;
  title: string;
  uid?: number;
  newPage?: boolean;
}

export class Menus {
  [index: number]: Menu;
}
