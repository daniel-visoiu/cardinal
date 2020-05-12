const args = process.argv;
const octopus = require("octopus");
//const FSExtension = require("../node_modules/octopus/lib/utils/FSExtension").fsExt;

if (args.length < 3) {
  console.log("Usage: npm run dist path_Where_to_copy_cardinal_dist[,another_path] \n\n");
  process.exit(1);
}
let destination = args[2];

let destinationArray = destination.split(",").map(destination => destination.trim());

let cardinalCopy = {
  name: "copy cardinal",
  actions: []
}

let config = {
  workDir: ".",
  dependencies: [{
    name: "cardinal build",
    actions: [{
      type: "execute",
      cmd: "npm run build"
    }]
  },
    cardinalCopy]
};
for (let i = 0; i < destinationArray.length; i++) {
  destination = destinationArray[i];
  console.log(`Copying cardinal in ${destination}`);
  cardinalCopy.actions.push({
    type: "copy",
    "src": "./dist/cardinal/",
    "target": destination + "/cardinal"
  });
}

octopus.run(config, function (err, result) {
  if (err) {
    throw err;
  }
  console.log("Job done!");
})


