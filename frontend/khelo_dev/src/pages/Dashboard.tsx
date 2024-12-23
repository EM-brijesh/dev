
import Card from "../components/Static_card";

const App = () => {
  const events = [
    {
      title: "Cricket at the Park",
      desc: "Join us for an exciting cricket match!",
      date: "December 9, 2024, 4:00 PM",
      location: "Central Park",
      isFull: false,
      participants: ["Alice", "Bob", "Charlie"],
      vacant: 5,
    },
    {
      title: "Football Frenzy",
      desc: "Show off your skills in this friendly match.",
      date: "December 10, 2024, 5:00 PM",
      location: "Downtown Stadium",
      isFull: false,
      participants: ["David", "Eve"],
      vacant: 8,
    }

  ];

  return (
    <>
      {/* Header Section */}
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div className="text-3xl font-bold">Khel happening around you</div>
        <button className="p-2 border-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
          Create Event
        </button>
      </div>

      {/* Cards Grid */}
      <div className="p-8 bg-gray-100">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event, index) => (
            <Card key={index} {...event} />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
