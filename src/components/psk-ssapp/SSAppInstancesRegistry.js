function registerPowerCord(identity){
  //powercord to communicate with the iframe
  //$$.swarmEngine.plug(identity, pc);
}

class SSAppInstancesRegistry {
  registry = [];

  constructor(){
    if(typeof $$.flows === "undefined"){
      require('callflow').initialise();
    }
    const se = require("swarm-engine");
    se.initialise("wallet");
  }

  addSSAppReference(ssappName, reference) {
    if (typeof this.registry[ssappName] !== "undefined" && this.registry[ssappName] !== reference) {
      //todo: what should do when this happens
      console.log("Replacing a reference.");
    }else{
      //todo: build a powercord identity based on ssappName
      //registerPowerCord();
    }
    this.registry[ssappName] = reference;
  }

  removeSSAppReference(ssappName) {
    if (typeof this.registry[ssappName] === "undefined") {
      return;
    }
    delete this.registry[ssappName];
  }

  getSSAppReference(ssappName) {
    return this.registry[ssappName];
  }
}

let instance = new SSAppInstancesRegistry();

export default {
  getInstance: function () {
    return instance;
  }
};
