const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

const url = 'https://bandcamp.com/djmarcusmcb'

async function scrapeData() {
  try {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const listItems = $('.collection-items ol li')
    const releases = []

    listItems.each((idx, el) => {
      const releaseItem = { id: '', title: '', artist: '', artwork: '', url: '' }
      // scrape title value
      let titleVal = $(el).find('div.collection-item-title').first().text()
      // scrape artist value
      let artistVal = $(el).find('div.collection-item-artist').first().text()
      // scrape image src
      let artwork = $(el).find('img.collection-item-art').attr('src')
      // scrape link back to product page
      let artistUrl = $(el).find('a.item-link').attr('href')
      
      // check to see if scraped elements are null/undefined
      // skip them if they are; otherwise, push new obj to array

      if (
        titleVal.length != 0 &&
        artistVal.length != 0 &&
        artwork.length != 0 &&
        artistUrl.length != 0
      ) {
        titleVal = JSON.stringify(titleVal)
        titleVal = titleVal.split('\\')[0]
        titleVal = titleVal.substring(1)
        artistVal = artistVal.substring(3)

        releaseItem.id = idx
        releaseItem.url = artistUrl
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
    return releases
  } catch (err) {
    console.error(err)
  }
}

app.use(cors())

app.get('/', async (req, res) => {
  let data = await scrapeData()
  res.send(data)
})

app.listen(PORT, () => {
  console.log(`Express app running on PORT ${PORT}`)
})


