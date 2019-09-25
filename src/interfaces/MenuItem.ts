export interface MenuItem {
  path: string,
  name: string,
  icon: string,
  type: string,
  active:boolean,
  children:MenuItem[],
  component:string,
  componentProps:any
  exactMatch:boolean
}
