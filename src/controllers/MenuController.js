import AbstractController from "./AbstractController";

export default class MenuController extends AbstractController{

  constructor(view){
    super();
    view.addEventListener('menuEvent', function (e) {
      console.log("MenuEvent din MenuController-el", e);
    });

    console.log("Added Menu Controller");
    document.addEventListener('menuEvent', function (e) {
      console.log("MenuEvent din MenuController", e.returnValue);
    });
  }


  getMenuItems() {
    return [{
      name: "Menu 1",
      path: "/menu1"
    },
      {
        name: "Menu 2",
        path: "/menu2"
      },
      {
        name: "Menu 3",
        path: "/menu3"
      }]
  }
}

