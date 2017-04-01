# Proxy Farm 

`proxyfarm` is a node script that scrapes proxy lists from websites without caring for its underlying HTML structure. This allows proxy lists to be easily harvested from a large amount of sources, without implementing custom scraping logic for each source. It does this via using a PhantomJS driver along with the [Javascript Selection API](https://developer.mozilla.org/en-US/docs/Web/API/Selection). This strips away all HTML tags and makes regex matching trivial. Proxy lists can be used with things like [scrapy-proxies](https://github.com/aivarsk/scrapy-proxies) in order to bypass IP restrictions and improve web crawling speed.

## Getting Started

Simply clone the repository, run `npm install`, and `node --harmony proxyfarm --in sources.txt --out proxies.txt`

NPM module coming soon!

### Arguments

| Parameter | Description                                                                                                                   |
| ---       | ---                                                                                                                           |
| in        | A text file with line delimited urls to scrape proxies from. See [defaults/sources.txt](defaults/sources.txt) for an example. |
| out       | The path to save the scraped proxy list to, in the format `<host>:<port>`                                                     |


### Prerequisites

- Node.js v6.x and later

## Running the tests

Coming soon!

## Contributing

There are many ways that you can contribute:

- **Improving documentation** - Submit a pull request with the fixes.
- **Requesting a feature** - Simply create a new issue with the said feature.
- **Suggesting a proxy list source** - Create a new issue mentioning the new source.
- **Report a bug** - Find a problem? Create an issue with your environment, screenshot of the error, and reproduction steps.
- **Fix a bug** - All help appreciated!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

