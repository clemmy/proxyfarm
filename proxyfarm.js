var fs = require('fs');
const phantom = require('phantom');

const GET_NICE_TEXT_JS = `function() {
  var s = window.getSelection();
  s.removeAllRanges();
  var r = document.createRange();
  r.selectNode(document.body);
  s.addRange(r);
  return s.toString();
}`;

var re = /([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})(\s+|:)([0-9]{2,5})/g

// TODO: Read proxy list
// TODO: Improve resilience to errors

async function main() {
    const instance = await phantom.create();
    const page = await instance.createPage();

    console.log('Requesting page...');
    const status = await page.open('http://proxydb.net/?availability=90');
    console.log(`Page status: status`);

    const jsEnabled = await page.setting('javascriptEnabled');
    console.log(`Javascript enabled: ${jsEnabled}`);

    const niceText = await page.evaluateJavaScript(GET_NICE_TEXT_JS);
    console.log(niceText);

    const matches = niceText.match(re) || [];
    console.log(`Proxies found on page: ${matches.length}`);

    const proxies = matches.map(s => s.replace(/\s+/, ':'));
    console.log(proxies);

    await instance.exit();
}

main();
