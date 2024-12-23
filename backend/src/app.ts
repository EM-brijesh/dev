import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { getDistance } from 'geolib';

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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
