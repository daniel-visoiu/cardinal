const path = require('path');
const octopus = require('octopus');

function buildCardinal(production = true) {
  return {
    name: 'build cardinal',
    actions: [{
      type: 'execute',
      cmd: `npm run build-${production ? 'prod' : 'dev'}`
    }]
  }
}

function copyCardinal(destinations = []) {
  const config = {
    name: 'copy cardinal',
    actions: []
  }
  for (const destination of destinations) {
    console.log('Copying cardinal in', destination);

    config.actions.push({
      type: 'copy',
      src: './dist/cardinal',
      target: path.join(destination, 'cardinal'),
      options: { 'overwrite': true }
    })
  }
  return config;
}

function generateConfig() {
  const args = process.argv;

  if (args.length < 3) {
    console.error('Usage: npm run dist path_where_to_copy_cardinal_dist[,another_path]\n\n');
    process.exit(1);
  }

  let production = true;
  const destination = args[2];
  const destinations = destination.split(',').map(destination => destination.trim());

  if (args[args.length - 1] === 'dev') {
    production = false;
  }

  return {
    workDir: '.',
    dependencies: [
      buildCardinal(production),
      copyCardinal(destinations)
    ]
  };
}

octopus.run(generateConfig(), (err, result) => {
  if (err) {
    throw err;
  }
  console.log('\nOctopus result:', result);
  console.log('Job done!');
})
