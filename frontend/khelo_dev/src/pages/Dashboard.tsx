import { useEffect, useState } from "react";
import Card from "../components/Static_card";
import axios from "axios";

const App = () => {
  // State to store events, loading, and error
  const [events, setEvents] = useState([]);  // Initially set as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Retrieve the JWT token from local storage
        const token = localStorage.getItem("authToken");  // Ensure consistency in token key
  
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
  
        // Make the API request with the token in the Authorization header
        const response = await axios.get("http://localhost:3000/list", {
          headers: {
            Authorization: `Bearer ${token}`,  // Include token in Authorization header
          },
        });

        // Extract the events array from the response data
        const eventsData = response.data.events;  // Get events array from the response
        if (Array.isArray(eventsData)) {
            //@ts-ignore
          setEvents(eventsData);  // Set the events array to state
        } else {
          throw new Error("Events data is not in the expected format.");
        }

      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "Something went wrong!"); // Handle error response
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []); // Empty dependency array means this will run once when the component mounts
  
  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div className="text-3xl font-bold">Khel happening around you</div>
        <button className="p-2 border-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          Create Event
        </button>
      </div>

      <div className="p-8 bg-gray-100">
        {loading ? (
          <div className="text-center text-xl font-bold">Loading events...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center text-gray-600">No events available</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event: any) => (
              <Card
                key={event.id}
                title={event.title}
                desc={event.description}
                date={new Date(event.time).toLocaleString()}
                location={event.location}
                isFull={event.capacity <= (event.participants?.length || 0)} // Safe check for participants
                participants={event.participants?.map((p: any) => p.name) || []}  // Safe check for participants array
                vacant={event.capacity - (event.participants?.length || 0)}  // Safe check for participants
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
