import React, { Fragment, useEffect, useState } from 'react'
import './App.css'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const App = () => {
  const [items, setItems] = useState({})
  const [isBusy, setIsBusy] = useState(true)

  useEffect(() => {
    const getData = async () => {
      try {
        let req = await fetch('http://localhost:5000')
        let response = await req.json()
        return response
      } catch (err) {}
    }
    getData().then((data) => {
      setItems(data)
      setIsBusy(false)
    })
  }, [])

  return (
    <div className='App'>
      {isBusy ? (
        <p className='loading'>Scraping Bandcamp data...</p>
      ) : (
        <div className='card-collection'>
          {items.map((item, i) => (
            <Fragment key={i}>
              <div className='card-body'>
                <Card>
                  <CardMedia
                    component='img'
                    image={item.artwork}                    
                    alt='item artwork'
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                      {item.artist}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button>
                      <a href={item.url}>More...</a>
                    </Button>
                  </CardActions>
                </Card>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
