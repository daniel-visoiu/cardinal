import {normalizeModelChain} from "../utils/utilFunctions";

function BoundedModel(componentInstance, model) {

  this.createBoundedModel = function (property, bindedChain) {

    bindedChain = normalizeModelChain(bindedChain);

    let updateView = function () {
      componentInstance[property] = model.getChainValue(bindedChain);
    };

    model.onChange(bindedChain, updateView);
    updateView();


    return {
      updateModel:(value)=>{
          model.setChainValue(bindedChain, value);
      }
    }
  }
}

export default BoundedModel;
