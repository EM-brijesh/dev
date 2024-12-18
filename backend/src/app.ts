import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';


const JWT_SECRET = 'dasdjkhasfjkf';
const app = express();
const prisma = new PrismaClient();
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

//hardcoded_events
const events = [
  {
    id: 1,
    name: 'Football Match',
    location: { latitude: 19.0760, longitude: 72.8333 }, // Mumbai
    sport: 'football',
  },
  {
    id: 2,
    name: 'Cricket Match',
    location: { latitude: 19.2183, longitude: 72.9781 }, // Navi Mumbai
    sport: 'cricket',
  },
  {
    id: 3,
    name: 'Marathon',
    location: { latitude: 18.9400, longitude: 72.8358 }, // South Mumbai
    sport: 'running',
  },
];

app.use(express.json());

import { Request, Response, NextFunction } from 'express';
import { getDistance } from 'geolib';

// Extend the Request interface to include the user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the Authorization header (Bearer token)

  if (!token) {
     res.status(401).json({ message: 'Token missing or invalid' });
  }
  //@ts-ignore
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
       res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Hello this is for testing the basic route');
});

//signup-signin routes
app.post('/signup', async (req, res) => {
  const { email, username, password, location } = req.body;

  if (!email || !username || !password || !location) {
     res.status(400).json({ message: 'Missing Fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
       res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        location
      }
    });

    res.status(201).json({
      message: 'User Created',
      userId: newUser.id
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({
      message: 'Error creating user',
    });
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: { username }
  });

  if (!existingUser) {
     res.status(403).json({
      message: 'Incorrect credentials'
    });
  }
//@ts-ignore
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
     res.status(403).json({
      message: 'Incorrect credentials'
    });
  }
  //@ts-ignore
  const token = jwt.sign({ id: existingUser.id }, JWT_SECRET);

  res.json({ token });
});

//create an event #1
app.post('/create', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, location, time , capacity, description } = req.body;
    const creatorId = (req.user as any).id; // Get user ID from the decoded JWT

    const newEvent = await prisma.event.create({
      data: {
        title,
        location,
        time: new Date(time),
        creatorId,
        capacity,
        description
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      message: 'Error creating event',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

//create an event and store it in lon-lat this will use mapbox .
// async function geocodeLocation(location: string): Promise<{ latitude: number; longitude: number }> {
//   // Simplify the address string before passing it to geocoding service
//   const simplifiedLocation = simplifyAddress(location);

//   const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedLocation)}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data && data.length > 0) {
//       const { lat, lon } = data[0];
//       return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
//     } else {
//       throw new Error('No coordinates found for the address');
//     }
//   } catch (err) {
//     //@ts-ignore
//     console.error('Geocoding error:', err.message);
//     throw err;
//   }
// }

// Helper function to simplify the address string
// function simplifyAddress(address: string): string {
//   // Simplifying address to core parts
//   const match = address.match(/([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)$/);
//   if (match) {
//     return `${match[1]}, ${match[2]}, ${match[3]}, ${match[4]}`; // Core address parts
//   }
//   // Default fallback to the last three parts if match fails
//   const parts = address.split(',');
//   return parts.slice(-3).join(',').trim();
// }
// app.post('/create_event', authenticateToken, async (req: Request, res: Response) => {
//   try {
//     const { title, location, time, capacity, description } = req.body;
//     const creatorId = (req.user as any).id; // Extract user ID from JWT

//     // Geocode the location to get latitude and longitude
//     const { latitude, longitude } = await geocodeLocation(location);

//     // Create the event in the database
//     const newEvent = await prisma.event.create({
//       data: {
//         title,
//         location,
//         latitude,
//         longitude,
//         time: new Date(time),
//         creatorId,
//         capacity,
//         description,
//       },
//       include: {
//         creator: {
//           select: {
//             id: true,
//             username: true,
//             email: true,
//           },
//         },
//       },
//     });

//     res.status(201).json({
//       message: 'Event created successfully',
//       event: newEvent,
//     });
//   } catch (error) {
//     console.error('Event creation error:', error);
//     res.status(500).json({
//       message: 'Error creating event',
//       error: error instanceof Error ? error.message : 'Unknown error',
//     });
//   }
// });


//get events based on userslocation passeed by token 


app.get('/list' , authenticateToken , async (req: Request , res: Response) => {
    try{
        const userId = req.user.id
        const user = await prisma.user.findUnique({
            where: {
              id:userId
            },select:{
                location:true
            }
        })
        if(!user){
            res.status(404).json({message : "User Not Found"})
        }
        const eventsonDashboard = await prisma.event.findMany({
            where:{
                location:{
                  contains :user?.location
                } 
            },
            include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    email: true
                  }
                }
              },
              orderBy: {
                time: 'asc' // Optional: order by upcoming events
              }
        
        })
        res.status(200).json({
            message: 'Events found',
            events: eventsonDashboard,
            //@ts-ignore
            userLocation: user.location
        })
    }catch(error){
        console.error('Error fetching events:', error);
    res.status(500).json({ 
      message: 'Error fetching events', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });

    }
})

//get events based on location passed in query
app.get('/events-by-location', authenticateToken, async (req: Request, res: Response) => {
    try {
      // Allow optional location query parameter
      const { location } = req.query;
  
      // If no location provided, use user's location
      const userId = (req.user as any).id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { location: true }
      });
  
      const searchLocation = (location as string) || user?.location;
  
      if (!searchLocation) {
         res.status(400).json({message: 'No Location specified'})
      }
  
      // Find events matching the location (case-insensitive)
      const events = await prisma.event.findMany({
        where: {
          location: {
            contains: searchLocation,
            mode: 'insensitive' // Allow partial and case-insensitive matches
          }
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        },
        orderBy: {
          time: 'asc'
        }
      });
  
      res.status(200).json({
        message: 'Events found',
        events,
        searchLocation
      });
    } catch (error) {
      console.error('Error searching events by location:', error);
      res.status(500).json({ 
        message: 'Error searching events', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });


//join and event

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users });
});


//add-event route #2
// app.post('/addevent', authenticateToken, async (req, res) => {
//   const { title, description, location, time, capacity } = req.body;

//   // Make sure the required fields are present
//   if (!title || !location || !time || !capacity) {
//      res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Create new event and link it to the authenticated user (creator)
//     const event = await prisma.event.create({
//       data: {
//         title,
//         description: description || "",  // Default empty string if not provided
//         location,
//         time: new Date(time),  // Assuming the time is passed as a string, converting to Date
//         capacity: parseInt(capacity, 10),  // Ensure capacity is an integer
//         creatorId: req.user.id,  // Use the authenticated user's ID
//       },
//     });

//     // Return the created event as a response
//     res.status(201).json({
//       message: 'Event created successfully',
//       event,
//     });
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ message: 'Error creating event' });
//   }
// });

//get events on dashboard using : geolocation
app.get('/nearby', async (req: Request, res: Response) => {
  const { latitude, longitude, radius } = req.body;

  // Validate input
  if (!latitude || !longitude) {
     res.status(400).json({ message: 'Please provide latitude and longitude.' });
  }

  if (!radius || typeof radius !== 'number') {
     res.status(400).json({ error: 'Radius is required and must be a number.' });
  }

  try {
    // Get all events from the database
    const events = await prisma.event.findMany();

    // Function to convert address to latitude/longitude using OpenStreetMap
    const getCoordinates = async (address: string) => {
      try {
        const response = await axios.get(NOMINATIM_URL, {
          params: {
            q: address,
            format: 'json',
            addressdetails: 1,
            limit: 1,
          },
        });
        const data = response.data[0];
        if (!data) {
          throw new Error('Location not found');
        }
        
        // Return the coordinates as an object
        return { latitude: parseFloat(data.lat), longitude: parseFloat(data.lon) };
      } catch (error) {
        throw new Error('Error fetching location from OpenStreetMap');
      }
    };

    // Find nearby events
    const nearbyEvents = [];
    for (const event of events) {
      try {
        //@ts-ignore
        const { latitude: eventLat, longitude: eventLon } = await getCoordinates(event.location);
        const distance = getDistance({ latitude, longitude }, { latitude: eventLat, longitude: eventLon });

        // Check if the event is within the specified radius
        if (distance <= radius) {
          nearbyEvents.push(event);
        }
      } catch (error) {
        console.error('Error fetching coordinates for event:', event.title);
      }
    }

    // Return nearby events
    res.json({ nearbyEvents });
  } catch (err) {
    res.status(500).json({ message: 'Server error', err });
  }
});






// Optional Profile Route
app.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id; // Get user ID from the decoded JWT
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
       res.status(404).json({ message: 'User not found' });
    }
    //@ts-ignore
    res.status(200).json({
      message: 'User profile fetched successfully',
      user: {
        //@ts-ignore
        id: user.id,
        //@ts-ignore
        username: user.username,//@ts-ignore
        email: user.email,//@ts-ignore
        location: user.location,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

app.listen(3000, () => {
  console.log('Server Started on Port 3000');
});
