import React from 'react'
import {Boton} from '../components'

const Home = () => {
  return (
    <div className="p-4">
      <div>Home</div>
      <Boton onClick={() => alert("Click en el botón")}>
        ¡Presióname!
      </Boton>
    </div>
  )
}

export default Home