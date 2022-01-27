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
      const releaseItem = { title: '', artist: '', artwork: '' }
      // scrape title value
      let titleVal = $(el).find('div.collection-item-title').first().text()
      // scrape artist value
      let artistVal = $(el).find('div.collection-item-artist').first().text()
      // scrape image src
      let artwork = $(el).find('img.collection-item-art').attr('src')

      // check to see if scraped elements are null/undefined
      // skip them if they are; otherwise, push new obj to array

      if (
        titleVal.length != 0 &&
        artistVal.length != 0 &&
        artwork.length != 0
      ) {
        titleVal = JSON.stringify(titleVal)
        titleVal = titleVal.split('\\')[0]
        titleVal = titleVal.substring(1)
        artistVal = artistVal.substring(3)
        releaseItem.artwork = artwork
        releaseItem.title = titleVal
        releaseItem.artist = artistVal
        releases.push(releaseItem)
      }
    })

    // Write releases array in releases.json file
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
