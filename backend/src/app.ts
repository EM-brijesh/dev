import express, { Request, Response, NextFunction, } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { getDistance } from 'geolib';
import { parse } from 'path';

const JWT_SECRET = 'dasdjkhasfjkf';
const app = express();
const prisma = new PrismaClient();

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

app.use(cors());
app.use(express.json());

// Middleware to authenticate token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded as { id: number };
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Hello, this is a basic route for testing.');
});
//@ts-ignore
app.post('/signup', async (req, res) => {
  const { username, password, location } = req.body;

  if (!username || !password || !location) {
    return res.status(400).json({ message: 'Missing Fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      //@ts-ignore
      data: {
        username,
        password: hashedPassword,
        location,
      },
    });

    res.status(201).json({
      message: 'User Created',
      userId: newUser.id,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

//@ts-ignore
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return res.status(403).json({ message: 'Incorrect credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: 'Incorrect credentials' });
    }

    const token = jwt.sign({ id: existingUser.id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Error signing in' });
  }
});
//@ts-ignore
app.post('/create', authenticateToken, async (req: Request, res: Response) => {
  const { title, location, time, capacity, description } = req.body;

  if (!title || !location || !time || !capacity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const creatorId = req.user?.id;

    if (!creatorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        location,
        time: new Date(time),
        creatorId,
        capacity,
        description: description || '',
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
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
    res.status(500).json({ message: 'Error creating event' });
  }
});
//@ts-ignoreß
app.get('/list', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { location: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const eventsOnDashboard = await prisma.event.findMany({
      where: {
        location: {
          contains: user.location,
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { time: 'asc' },
    });

    res.status(200).json({
      message: 'Events found',
      events: eventsOnDashboard,
      userLocation: user.location,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

//@ts-ignore
app.post('/events/:eventId/join', authenticateToken,  async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const { count } = req.body;
  const userId = req.user?.id; // Assuming user ID is extracted from the token middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!count || count <= 0) {
    return res.status(400).json({ message: 'Invalid participant count' });
  }

  try {
    // Fetch the event
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if enough capacity is available
    if (event.capacity < count) {
      return res.status(400).json({ message: 'Not enough capacity available' });
    }

    // Check if user is already a participant
    const existingParticipant = await prisma.participant.findFirst({
      where: { eventId: parseInt(eventId), userId },
    });

    if (existingParticipant) {
      return res.status(400).json({ message: 'User already joined this event' });
    }

    // Create participant entry
    await prisma.participant.create({
      data: {
        eventId: parseInt(eventId),
        userId,
        joinedAt: new Date(),
      },
    });

    // Update event capacity
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: {
        capacity: event.capacity - count,
      },
    });

    return res.status(200).json({ message: 'Successfully joined the event' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});


//
//@ts-ignore
app.get('/events/joined',authenticateToken,  async (req :Request, res): Response => {
  const userId = req.user?.id; // Extract user ID from the token middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const eventsJoined = await prisma.participant.findMany({
      where: { userId },
      include: {
        event: true, // Include event details
      },
    });

    const result = eventsJoined.map(participant => participant.event);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

//
//@ts-ignore
app.get('/events/created',authenticateToken ,  async (req: Request, res: Response) => {
  const userId = req.user?.id; // Extract user ID from the token middleware

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const eventsCreated = await prisma.event.findMany({
      where: { creatorId: userId },
    });

    return res.status(200).json(eventsCreated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
