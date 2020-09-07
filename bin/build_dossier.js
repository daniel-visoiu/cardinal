const DOSSIER_SEED_FILE_PATH = "./seed";
const BRICK_STORAGE_ENDPOINT = process.env.SSAPPS_FAVORITE_EDFS_ENDPOINT || "http://localhost:8080";

require("./../../privatesky/psknode/bundles/csbBoot.js");
require("./../../privatesky/psknode/bundles/edfsBar.js");
const fs = require("fs");
const EDFS = require("edfs");
$$.BDNS.addConfig("default", {
  endpoints: [
    {
      endpoint: BRICK_STORAGE_ENDPOINT,
      type: 'brickStorage'
    },
    {
      endpoint: BRICK_STORAGE_ENDPOINT,
      type: 'anchorService'
    }
  ]
})
function storeKeySSI(seed_path, keySSI, callback) {
  fs.writeFile(seed_path, keySSI, (err) => {
    return callback(err, keySSI);
  });
}

function createDossier(callback) {
  EDFS.createDSU("Bar", (err, bar) => {
    if (err) {
      return callback(err);
    }

    updateDossier(bar, callback);
  })
}

function updateDossier(bar, callback) {
  bar.delete("/", function (err) {
    if (err) {
      throw err;
    }

    bar.addFolder("dist/cardinal", "/", (err, archiveDigest) => {
      if (err) {
        return callback(err);
      }
      bar.getKeySSI((err, keySSI) => {
        if (err) {
          return callback(err);
        }
        storeKeySSI(DOSSIER_SEED_FILE_PATH, keySSI, callback);
      });
    });
  });
}

function build_dossier(callback) {
  fs.readFile(DOSSIER_SEED_FILE_PATH, (err, content) => {
    if (err || content.length === 0) {
      console.log(`Creating a new Dossier...`);
      return createDossier(callback);
    }

    console.log("Build dossier ===================", content.toString());
    let keySSI;
    try {
      keySSI = require("key-ssi-resolver").KeySSIFactory.create(content.toString());
    } catch (err) {
      console.log("Invalid seed. Creating a new Dossier...");
      return createDossier(callback);
    }

    if (keySSI.getHint() !== BRICK_STORAGE_ENDPOINT) {
      console.log("Endpoint change detected. Creating a new Dossier...");
      return createDossier(callback);
    }

    console.log("Dossier updating...");
    EDFS.resolveSSI(content.toString(), "Bar", (err, bar) => {
      if (err) {
        return callback(err);
      }

      updateDossier(bar, callback);
    });
  });
}

build_dossier(function (err, keySSI) {
  let path = require("path");
  let projectName = path.basename(path.join(__dirname, "../"));
  if (err) {
    console.log(`Build process of <${projectName}> failed.`);
    console.log(err);
    process.exit(1);
  }
  console.log(`Build process of <${projectName}> finished. Dossier's KeySSI:`, keySSI);
});
