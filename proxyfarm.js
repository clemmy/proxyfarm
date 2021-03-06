#!/usr/bin/env node --harmony

const fs = require('fs');
const path = require('path');
const phantom = require('phantom');
const program = require('commander');

const GET_NICE_TEXT_JS = `function() {
  var s = window.getSelection();
  s.removeAllRanges();
  var r = document.createRange();
  r.selectNode(document.body);
  s.addRange(r);
  return s.toString();
}`;

const DEFAULT_IN = path.resolve(__dirname, 'defaults/sources.txt');
const DEFAULT_OUT = 'out.txt';

var re = /([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})(\s+|:)([0-9]{2,5})/g;

// Get user arguments
program
  .version('0.0.1')
  .description('Farm and validate proxies from custom proxy list sources.')
  .option('-i, --in <type>', 'filepath of proxy list sources')
  .option('-o, --out <type>', 'path to output proxy list')
  .parse(process.argv);

let outputPath;
if (program.out) {
  outputPath = path.resolve(process.cwd(), program.out);
}

let proxyListSourcesRaw;
try {
  proxyListSourcesRaw = fs.readFileSync(program.in || DEFAULT_IN, {encoding: 'utf8'});
} catch(err) {
  console.error(`Error opening file: ${program.in || DEFAULT_IN}`);
  process.exit(1);
}

const proxyListSources = proxyListSourcesRaw.split(/\r?\n/).filter(line => !!line);
console.log(`Scraping from ${proxyListSources.length} sources...`);

async function main() {
  const instance = await phantom.create(['--ignore-ssl-errors=yes']);
  const page = await instance.createPage();

  await page.setting('userAgent', 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36')

  for (const source of proxyListSources) {
    try {
      console.log(`Requesting page ${source}...`);
      const status = await page.open(source);
      console.log(`Page status: ${status}`);
      if (status !== 'success')
        throw new Error('Request failed');

      const jsEnabled = await page.setting('javascriptEnabled');
      console.log(`Javascript enabled: ${jsEnabled}`);
      if (!jsEnabled)
        throw new Error('Javascript disabled');

      const niceText = await page.evaluateJavaScript(GET_NICE_TEXT_JS);
      const matches = niceText.match(re) || [];
      console.log(`Proxies found on page: ${matches.length}`);

      const proxies = matches.map(s => s.replace(/\s+/, ':')).filter(l => !!l.trim());

      fs.appendFileSync(outputPath || DEFAULT_OUT, proxies.join('\n') + '\n');
      console.log('Proxies successfully written to: ' + (outputPath || DEFAULT_OUT));
    } catch(e) {
      console.error(`An error occurred while scraping ${source}. Skipping.`);
      continue;
    }
  }

  await instance.exit();
}

main();
