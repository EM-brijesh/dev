"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const JWT_SECRET = 'dasdjkhasfjkf';
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};
// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is a basic route for testing.');
});
//@ts-ignore
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, location } = req.body;
    if (!username || !password || !location) {
        return res.status(400).json({ message: 'Missing Fields' });
    }
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
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
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Error creating user' });
    }
}));
//@ts-ignore
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({
            where: { username },
        });
        if (!existingUser) {
            return res.status(403).json({ message: 'Incorrect credentials' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: 'Incorrect credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser.id }, JWT_SECRET);
        res.json({ token });
    }
    catch (err) {
        console.error('Signin error:', err);
        res.status(500).json({ message: 'Error signing in' });
    }
}));
//@ts-ignore
app.post('/create', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, location, time, capacity, description } = req.body;
    if (!title || !location || !time || !capacity) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const creatorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!creatorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const newEvent = yield prisma.event.create({
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
    }
    catch (error) {
        console.error('Event creation error:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
}));
//@ts-ignoreß
app.get('/list', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { location: true },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const eventsOnDashboard = yield prisma.event.findMany({
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
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
}));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
