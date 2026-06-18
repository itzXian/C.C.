const YAML = require('yaml');
const FS   = require('fs');

const Custom = require('./custom.js');
let   Config = YAML.parse(FS.readFileSync('./conf.yaml', 'utf8'));
Custom.main(Config);

FS.writeFile('./new.yaml', YAML.stringify(Config), (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('write end');
    };
});
