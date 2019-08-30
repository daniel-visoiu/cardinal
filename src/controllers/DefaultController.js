export default class DefaultController {

  constructor(view){
    document.addEventListener("click",(event)=>{
      console.log("Default Controller",event);
    })
  }

}

