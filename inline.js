/* tslint:disable:no-eval */
var path = require('path');
var dirname = path.dirname;
var join = path.join;

var fs = require('fs');
var readFileSync = fs.readFileSync;
var writeFileSync = fs.writeFileSync;
var glob = require('glob');
var sync = glob.sync;

main();

function main() {
  var file = "md-datetimepicker.umd.js";
  var map = "md-datetimepicker.umd.js.map";
    inlineResources('src/'+file);
    fs.rename('src/'+file, 'bundles/'+file, function (err) {
    if (err) throw err;
     fs.rename('src/'+map, 'bundles/'+map, function (err) {
      if (err) throw err;
    });
  });
}

/** Finds all JavaScript files in a directory and inlines all resources of Angular components. */
function inlineResourcesForDirectory(folderPath) {
  glob(join(folderPath, '**/*.js')).forEach(filePath => inlineResources(filePath));
}

/** Inlines the external resources of Angular components of a file. */
function inlineResources(filePath) {
  let fileContent = readFileSync(filePath, 'utf-8');

  fileContent = inlineTemplate(fileContent, filePath);
  fileContent = inlineStyles(fileContent, filePath);

  writeFileSync(filePath, fileContent, 'utf-8');
}

/** Inlines the templates of Angular components for a specified source file. */
function inlineTemplate(fileContent, filePath) {
  return fileContent.replace(/templateUrl:\s*'([^']+?\.html)'/g, (_match, templateUrl) => {
    const templatePath = join(dirname(filePath), templateUrl);
    const templateContent = loadResourceFile(templatePath);
    return `template: "${templateContent}"`;
  });
}

/** Inlines the external styles of Angular components for a specified source file. */
function inlineStyles(fileContent, filePath) {
  return fileContent.replace(/styleUrls:\s*(\[[\s\S]*?])/gm, (_match, styleUrlsValue) => {
    // The RegExp matches the array of external style files. This is a string right now and
    // can to be parsed using the `eval` method. The value looks like "['AAA.css', 'BBB.css']"
    const styleUrls = eval(styleUrlsValue);

    const styleContents = styleUrls
      .map(url => join(dirname(filePath), url))
      .map(path => loadResourceFile(path));

    return `styles: ["${styleContents.join(' ')}"]`;
  });
}

/** Loads the specified resource file and drops line-breaks of the content. */
function loadResourceFile(filePath) {
  return readFileSync(filePath, 'utf-8')
    .replace(/([\n\r]\s*)+/gm, ' ')
    .replace(/"/g, '\\"');
}
