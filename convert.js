const oldConfigFile = "./conf.yaml"
const overrideScript = "./custom.js"
const newConfigFile = "./new.yaml"

const YAML = require('yaml')
const fs = require('fs')

const file = fs.readFileSync(oldConfigFile, 'utf8')
let config = YAML.parse(file)

const Test = require(overrideScript)
Test.main(config);

const yamlString = YAML.stringify(config);

fs.writeFile(newConfigFile, yamlString, (err, data) => {
  if(err) console.log(err);
  else console.log('write end');
});
