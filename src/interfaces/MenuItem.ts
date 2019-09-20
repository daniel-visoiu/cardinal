export interface MenuItem {
  path: string,
  name: string,
  icon: string,
  type: string,
  children:MenuItem[]
}
