const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const url = 'https://bandcamp.com/djmarcusmcb'

async function scrapeData() {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const listItems = $('.collection-items ol li')
    const releases = []

    listItems.each((idx, el) => {
      const releaseItem = { title: '', artist: '' }
      // scrape title value
      let titleVal = $(el).find('div.collection-item-title').first().text()
      // scrape artist value
      let artistVal = $(el).find('div.collection-item-artist').first().text()

      if (titleVal.length != 0 && artistVal.length != 0) {
        titleVal = JSON.stringify(titleVal)
        titleVal = titleVal.split('\\')[0]
        titleVal = titleVal.substring(1)
        artistVal = artistVal.substring(3)
        releaseItem.title = titleVal
        releaseItem.artist = artistVal
        releases.push(releaseItem)
      }
    })

    // Write releases array in countries.json file
    fs.writeFile('releases.json', JSON.stringify(releases, null, 2), (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log('Successfully written data to file')
      console.log(releases)
    })
  } catch (err) {
    console.error(err)
  }
}

scrapeData()
