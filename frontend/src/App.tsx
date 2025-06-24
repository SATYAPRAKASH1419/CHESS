
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import { Landing } from './pages/LandingPage'
import { Game } from './pages/Game'

function App() {


  return (
    <>
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 min-h-screen w-full flex flex-col justify-between">

    
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/game" element={<Game/>}  />
      </Routes>
     </BrowserRouter>
     </div>
    </>
  )
}

export default App
