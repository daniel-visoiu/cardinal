const args = process.argv;
const FSExtension = require("../node_modules/octopus/lib/utils/FSExtension").fsExt;

if (args.length < 2) {
  throw new Error("No destination was provided")
}
let destination = args[2];

let destinationArray = destination.split(",").map(destination => destination.trim());

for (let i = 0; i < destinationArray.length; i++) {
  destination = destinationArray[i];
  console.log(`Copying cardinal in ${destination}`);
  FSExtension.copyDir("./../../dist/cardinal/", destination+"/cardinal")
}


