import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './pages/home'
import Card from './components/Static_card'
import { Footer } from './components/Footer'

 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Home/>
    <div className="flex justify-center items-center mt-4">
      <div className="grid grid-cols-3 gap-8">
        
        <Card
            title="Cricket Match"
            desc="Need 6 Players for the match against FCB" time={"3:20"} location={"ISF Turf Kanaika"} count={'6'}        />
        <Card
            title="FootBall Match"
            desc="Need 6 Players for the match against FCB" time={"3:20"} location={"ISF Turf Kanaika"} count={'6'}         />
        <Card
            title="Volley SESh!"
            desc="Need 6 Players for the match against FCB" time={"3:20"} location={"ISF Turf Kanaika"} count={'6'}        />
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default App
