const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const stringifyObject = require('stringify-object');
const flatten = require('flat');

const en = fs.readFileSync('./input/en.json', 'utf-8');
const flattenEN = flatten(JSON.parse(en));
const keywords = Object.keys(flattenEN);
const englishValues = Object.values(flattenEN)

readXlsxFile('./input/languages.xlsx').then(data => {
  const next = {};
  for (let i = 0; i < keywords.length; i++) {
    for (let j = 0; j < englishValues.length; j++) {
      if (data && data[i] && data[i][0] === englishValues[j]) {
        next[keywords[j]] = data[i][1];
      }
    }
  }
  const allKeysOfNext = Object.keys(next);
  const remainingKeys = keywords.filter(key => !allKeysOfNext.includes(key));

  remainingKeys.map((remainingKey, index) => {
      keywords.map((keyword, keywordIndex)=>{
        if (remainingKey === keyword) {
          next[remainingKey] = englishValues[keywordIndex];
        }
      });
  })

  const unflattenNext = flatten.unflatten(next);

  const formattedStringTranslate = stringifyObject(unflattenNext,
    {
      indent: '  ',
      singleQuotes: false
    })

  fs.writeFile('./output/next.json', formattedStringTranslate, 'utf8', () => { });
})