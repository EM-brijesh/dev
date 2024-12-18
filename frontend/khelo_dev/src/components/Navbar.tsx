export const Navbar = () => {
  return (
    <><div className="flex , justify-around , mt-4">
      <div className='text-3xl , font-bold , text-blue-600 '>
        Khelo
      </div>
      <button className=" p-2 border-2 rounded-2xl bg-blue-600 text-white">
        Get Started
      </button>

    </div>

      <div className="bg-blue-200 relative flex flex-col items-center py-8 h-96 pt-16 mt-4">
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