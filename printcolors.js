// Read out the theme files, grab the colors,
// Make a list of all colors
const fs = require("fs");
const stripJSONComments = require("strip-json-comments");

const readJSON = jsonFile => {
  const data = fs.readFileSync(jsonFile, "utf8");
  return JSON.parse(stripJSONComments(data));
};

const darkTheme = readJSON("test.json");
// const darkTheme = readJSON("./themes/dark.json");

const flattenObject = ob => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == "object") {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + "." + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

const darkThemeFlattened = flattenObject(darkTheme);
const darkThemeArray = Object.keys(darkThemeFlattened).map(
  key => darkThemeFlattened[key]
);

// -- -- -- --

const hexPattern = /^((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})$/gi;

// "hex color": recurrence count
let colors = {};

// Search flattened array for potential hex colors
// If found, see if it's a duplicate
for (let item of darkThemeArray) {
  if (item.match(hexPattern)) {
    if (!colors[item]) {
      // If new, set recurrence to 1
      colors[item] = 1;
    } else {
      // If duplicate, increase recurrence by one
      colors[item]++;
    }
  }
}

// I understand I'm going between json and arrays like fucking crazy
// scripts arent elegant

let colorArr = [];
for (let color in colors) {
  colorArr.push([color, colors[color]]);
}
colorArr.sort((a, b) => {
  return b[1] - a[1];
});

const sortedColors = {};
colorArr.forEach(item => (sortedColors[item[0]] = item[1]));
const colorsFileData = JSON.stringify(sortedColors, null, 2);

fs.writeFileSync("colors.json", colorsFileData);

// fs.writeFile("colors.json", colors, "utf8", err => {
//   if (err) {
//     console.log("An error occured while writing JSON Object to File.");
//     return console.log(err);
//   }

//   console.log("JSON file has been saved.");
// });

// const darkThemeFlattened = darkThemeArray.flat(Infinity);
// console.log(darkThemeArray);
