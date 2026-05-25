// apps/api/src/worker.ts
import { Worker } from 'bullmq';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { connectDB } from './config/db.js';
import { Assignment } from './models/assignment.js';

dotenv.config();
connectDB();

// Initialize the client to point to OpenRouter instead of OpenAI
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const worker = new Worker('ai-generation', async job => {
  const { assignmentId, promptData } = job.data;
  console.log(`[Worker] Picked up job for assignment: ${assignmentId}`);

  try {
    // 1. The Strict System Prompt
    // We explicitly define the expected JSON schema here.
    const systemPrompt = `You are an expert academic AI Assessment Creator. 
    Generate a question paper based strictly on the user's parameters.
    
    CRITICAL INSTRUCTION: You MUST respond ONLY with valid, raw JSON matching this exact structure. Do not include markdown formatting (like \`\`\`json) or any conversational text.
    {
      "sections": [
        {
          "title": "string (e.g., Section A: Multiple Choice)",
          "instructions": "string (e.g., Attempt all questions)",
          "questions": [
            {
              "text": "string (The actual question)",
              "difficulty": "Easy" | "Moderate" | "Hard",
              "marks": number
            }
          ]
        }
      ]
    }`;

    // 2. The User Parameters
    const userPrompt = `Create an assignment with these exact requirements:
    - Total Marks: ${promptData.totalMarks}
    - Number of Questions: ${promptData.numQuestions}
    - Question Types: ${promptData.questionTypes.join(', ')}
    - Additional Instructions: ${promptData.additionalInstructions || 'None'}`;

    console.log(`[Worker] Calling OpenRouter model: ${process.env.AI_MODEL}`);

    // 3. The API Call
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL as string,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      // This tells supported OpenRouter models to guarantee JSON output
      response_format: { type: "json_object" } 
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("LLM returned an empty response.");
    }

    // 4. Parse the response
    // If the LLM disobeyed and included markdown, this will fail and get caught by the catch block
    const parsedPaper = JSON.parse(content);

    // 5. Save the final result to MongoDB
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'COMPLETED',
      generatedPaper: parsedPaper
    });

    console.log(`[Worker] Successfully generated and saved paper for: ${assignmentId}`);

    return { assignmentId, paper: parsedPaper };

  } catch (error) {
    console.error(`[Worker] Job failed for ${assignmentId}:`, error);
    // Mark as FAILED so the frontend knows to stop waiting and show an error
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'FAILED' });
  }
}, {
  connection: { url: process.env.REDIS_URL! }
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job?.id} failed with reason: ${err.message}`);
});

console.log('BullMQ Worker is online and listening to Redis...');