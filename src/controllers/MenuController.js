export default class MenuController {

  constructor(view){
    console.log(view);

    view.addEventListener('MenuEvent', function (e) {
      console.log("MenuEvent din MenuController-el", e);
    });

    console.log("Added Menu Controller");
    document.addEventListener('MenuEvent', function (e) {
      console.log("MenuEvent din MenuController", e);
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

