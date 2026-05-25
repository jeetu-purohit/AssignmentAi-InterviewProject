// apps/api/src/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { Queue, QueueEvents } from 'bullmq';
import { connectDB } from './config/db';
import { Assignment } from './models/assignment.js';
import { AssignmentSchema } from '@veda/shared-types';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Create the HTTP Server and attach Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, restrict this to your Next.js URL
    methods: ['GET', 'POST']
  }
});

// 2. Handle WebSocket Connections
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // When the frontend loads the loading screen, it will join a room specific to its assignment ID
  socket.on('join_assignment', (assignmentId) => {
    socket.join(assignmentId);
    console.log(`[Socket] Client joined room: ${assignmentId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// 3. Setup BullMQ Queue & Event Listener
const redisConnection = { url: process.env.REDIS_URL };
const generationQueue = new Queue('ai-generation', { connection: redisConnection });
const queueEvents = new QueueEvents('ai-generation', { connection: redisConnection });

// When a worker finishes a job, broadcast the result to the specific room
queueEvents.on('completed', ({ returnvalue }) => {
  const result =
    typeof returnvalue === 'string'
      ? JSON.parse(returnvalue)
      : returnvalue;

  console.log(
    `[Socket] Broadcasting 'paper_ready' to room: ${result.assignmentId}`
  );

  io.to(result.assignmentId).emit('paper_ready', result.paper);
});

// 4. The Creation Route
app.post('/api/assignments', async (req, res) => {
  try {
    const validatedData = AssignmentSchema.parse(req.body);
    const newAssignment = await Assignment.create({
      ...validatedData,
      status: 'PENDING',
      generatedPaper: null
    });

    await generationQueue.add('generate-paper', {
      assignmentId: newAssignment._id,
      promptData: validatedData
    });

    res.status(201).json({ 
      success: true, 
      assignmentId: newAssignment._id,
      message: 'Assignment queued' 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid data or server error' });
  }
});

app.get('/api/assignments', async (req, res) => {
  try {
    // We sort by _id descending to get the newest ones first
    const assignments = await Assignment.find().sort({ _id: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

const PORT = process.env.PORT || 5000;
// CRITICAL: We use httpServer.listen here instead of app.listen!
httpServer.listen(PORT, () => {
  console.log(`Server & WebSockets running on port ${PORT}`);
});

// Boot the worker in the same process
import './worker';