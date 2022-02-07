import React, { Fragment, useEffect, useState } from 'react'
import './App.css'

import InfoCard from './components/infoCard'

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
        <p>Scraping Bandcamp data...</p>
      ) : (
        <div className='item-card'>
          {items.map((item, i) => (
            <Fragment key={i}>
              <InfoCard></InfoCard>
              <div>
                <span>{item.artist} {item.title}</span>   
                <br />                             
                <span><a href={item.url}>Link</a></span>               
                <br/> 
                <img src={item.artwork} width="300" height="300" alt={item.title}></img>     
                <hr />
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
