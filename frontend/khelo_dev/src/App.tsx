import './App.css';
import { Home } from './pages/home';
import Card from './components/Static_card';
import { Footer } from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/signin';
import { Signup } from './pages/signup';
import Dashboard from './pages/Dashboard';



function App() {
  return(

  
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <div className="flex justify-center items-center mt-4">
                <hr className="my-4" />
                <div className="grid grid-cols-3 gap-8">
                  {/* Cards only on Home page */}
                  <Card
                    title="Cricket Match"
                    desc="Need 6 Players for the match!"
                    date="20:00"
                    location="ISF Turf Kanaika"
                    vacant={6} isFull={false} participants={[]}                  />
                  <Card
                    title="FootBall Match"
                    desc="Any team up for FUTSAL?"
                    date="16:00"
                    location="Seven Eleven Turf , Mira Road"
                    vacant={6} isFull={false} participants={[]}
                  />
                  <Card
                    title="Volley SESh!"
                    desc="Join Morning Volleyball"
                    date="7:30"
                    location="Orange Ground Mira Road"
                    vacant={6} isFull={false} participants={[]}
                  />
                </div>
              </div>
              <hr className="my-6" />
              <Footer />
              
            </>
          }
        />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
  )
}

export default App;
