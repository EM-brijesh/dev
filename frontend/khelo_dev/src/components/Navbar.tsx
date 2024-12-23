import { Moon, Sun } from "lucide-react";
import { useState } from "react"

export const Navbar = () => {

  const [darkMode , setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark' , !darkMode);
  }
  return (
    <>
      <div className="flex justify-between items-center mt-4 mx-4 ml-16">
        <div className='text-3xl font-bold text-blue-600'>
          Khelo
        </div>
        <div className="flex space-x-4 mr-4">
          <button onClick={() => window.location.href = '/login'} className="p-2 border-2 rounded-2xl bg-blue-600 text-white">
            Sign Up
          </button>
          <button onClick={toggleDarkMode} className="p-2 border-2 rounded-2xl bg-blue-600 text-white">
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>

      <div className="bg-blue-200 relative flex flex-col items-center py-8 h-84 pt-16 mt-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80"
            alt="Sports background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <h2 className="text-4xl font-bold text-center p-2 mt-4 z-10">Your Sports Community awaits</h2>
        <h6 className="text-center mb-4 z-10">Join Khelo to discover local sports events, connect with fellow athletes, and make every game more exciting.</h6>
        <button className="p-2 border-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 z-10">
          Get Started
        </button>
      </div>
      <div  className="text-center font-bold text-4xl p-4"> 
        Why Choose Khelo?
        </div>

        <div className="text-center text-grey">
        Connect with local sports enthusiasts and make every game count
        </div>


    </>

  )
}   