import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client with required User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not defined. AI endpoints will run in fallback simulation mode.');
}

const COLLEGE_SYSTEM_PROMPT = `You are "CampusConnect AI", the official intelligent campus concierge and academic advisor for Apex Institute of Science & Technology (AIST).
You have deep knowledge of the campus:
- Departments: Computer Science & Engineering (Block A), AI & Data Science (Block B), Electronics & Communication (Block C), Mechanical Engineering (Block D), and School of Management (Block E).
- Facilities: Central Library (Floor 1-3, open 8:00 AM - 10:00 PM), Innovation Lab (Block B, 4th Fl), Cafeteria (Student Plaza), Sports Complex & Gym, Health Clinic (Near Gate 2), Placement & Training Cell (Admin Block, 2nd Fl).
- Timetable & Classes: Morning sessions 9:00 AM - 12:45 PM, Lunch 12:45 - 1:45 PM, Afternoon practicals/electives 1:45 - 4:45 PM.
- Attendance Policy: Minimum 75% mandatory attendance required to qualify for end-semester examinations.
- Grievance & Student Support: Grievance cell responds within 24-48 hours. Dean of Student Affairs: Dr. Eleanor Vance (Admin Block 104).
- Transport: Shuttle bus operates every 20 mins connecting North Gate, Metro Station, City Center, and South Dorms.
- WiFi & Tech: 'AIST-Student-5G', login with Student ID credentials. IT Helpdesk at Block A, Room 102.

Personality: Professional, encouraging, clear, concise, and deeply helpful. Format answers with clear bullet points or bold highlights when appropriate.`;

// AI Assistant Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      // High quality realistic simulated response if no API key is injected yet
      res.json({
        reply: `[CampusConnect AI]: Thank you for asking about "${message}". In our campus records, Central Library is open until 10:00 PM, attendance requirement is 75% minimum, and the next mid-term schedule is available under Academic Updates. If you need immediate assistance with course enrollment or room bookings, visit Admin Block Room 104 or consult your academic advisor.`,
      });
      return;
    }

    // Prepare contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const h of history.slice(-6)) {
        if (h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string') {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction: COLLEGE_SYSTEM_PROMPT,
      },
    });

    const reply = response.text || 'I could not generate a response. Please try again.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate chat response',
      details: 'Please check your Gemini API key in Settings > Secrets if this persists.',
    });
  }
});

// AI Study Buddy: Summarize notes
app.post('/api/study/summarize', async (req: Request, res: Response) => {
  try {
    const { notes, topic } = req.body;
    if (!notes || typeof notes !== 'string') {
      res.status(400).json({ error: 'Notes text is required' });
      return;
    }

    if (!ai) {
      res.json({
        summary: `### Core Summary (${topic || 'Study Notes'})\n\nThese notes focus on fundamental principles, core methodologies, and practical applications. Key mechanisms operate through structured inputs, verified algorithmic steps, and performance constraints.\n\n### Key Takeaways\n- **Principle 1**: Clear boundary definition between logical layers.\n- **Principle 2**: Time and space complexity trade-offs should be evaluated early.\n- **Principle 3**: Validation and test edge cases prevent cascading failures.`,
        keyConcepts: ['System Boundaries', 'Complexity Optimization', 'State Invariants', 'Edge Case Verification'],
        flashcards: [
          { front: 'What is the primary constraint mentioned?', back: 'Performance and consistency trade-offs across modules.' },
          { front: 'How should edge cases be handled?', back: 'Through explicit guards and deterministic boundary tests.' }
        ]
      });
      return;
    }

    const prompt = `You are an elite academic study coach. Analyze the following study notes on "${topic || 'Academic Material'}":
---
${notes}
---
Provide your response strictly in valid JSON format with the following keys:
{
  "summary": "A clear, well-structured markdown summary with headings, key takeaways, and bullet points",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
  "flashcards": [
    {"front": "Question/Term", "back": "Clear concise answer/definition"},
    {"front": "Question/Term", "back": "Clear concise answer/definition"},
    {"front": "Question/Term", "back": "Clear concise answer/definition"}
  ]
}
Return only JSON. Do not wrap in markdown code blocks if possible, or use standard JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = (response.text || '{}').trim();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        summary: raw,
        keyConcepts: ['Key Point 1', 'Key Point 2', 'Key Point 3'],
        flashcards: []
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: error?.message || 'Failed to summarize notes' });
  }
});

// AI Study Buddy: Generate Quiz
app.post('/api/study/quiz', async (req: Request, res: Response) => {
  try {
    const { topic, difficulty = 'Medium', count = 4 } = req.body;
    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    if (!ai) {
      res.json({
        quiz: [
          {
            question: `In the study of ${topic}, what is the primary role of foundational abstraction?`,
            options: [
              'To hide non-essential implementation details and simplify cognitive load',
              'To increase runtime memory footprint',
              'To prevent code execution across distributed clusters',
              'To eliminate the need for mathematical proofs'
            ],
            answerIndex: 0,
            explanation: 'Abstraction allows developers and researchers to focus on high-level interactions without being overwhelmed by low-level hardware or arithmetic details.'
          },
          {
            question: `Which methodology is universally recommended when verifying systems in ${topic}?`,
            options: [
              'Ad-hoc random guessing without documentation',
              'Systematic hypothesis testing and regression benchmarking',
              'Ignoring boundary conditions when inputs are large',
              'Only testing happy-path instances'
            ],
            answerIndex: 1,
            explanation: 'Systematic testing against deterministic benchmarks ensures predictability and reproducibility across iterations.'
          },
          {
            question: `How does optimization in ${topic} typically trade off resources?`,
            options: [
              'Increases both computation time and space indefinitely',
              'Often trades spatial cache memory for reduced algorithmic temporal latency',
              'Requires hardware replacement for every code alteration',
              'Has zero impact on CPU cycles'
            ],
            answerIndex: 1,
            explanation: 'The classic space-time trade-off allows caching or pre-computing states to drastically speed up query or processing speed.'
          }
        ]
      });
      return;
    }

    const prompt = `Generate a ${difficulty} difficulty multiple-choice quiz of ${count} questions on the topic "${topic}".
Output strictly valid JSON with this structure:
{
  "quiz": [
    {
      "question": "Clear and insightful academic question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answerIndex": 0, // integer 0 to 3 indicating the correct option
      "explanation": "Clear explanation of why this answer is correct and why others are false"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = (response.text || '{}').trim();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { quiz: [] };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Quiz error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate quiz' });
  }
});

// AI Concept Explainer
app.post('/api/study/explain', async (req: Request, res: Response) => {
  try {
    const { topic, level = 'undergraduate' } = req.body;
    if (!topic || typeof topic !== 'string') {
      res.status(400).json({ error: 'Topic is required' });
      return;
    }

    if (!ai) {
      res.json({
        concept: topic,
        explanation: `${topic} is a foundational pillar in modern engineering and science. Think of it like a coordinated traffic junction: specialized nodes process information while safety protocols prevent collisions.`,
        analogy: 'Imagine an airport flight control tower orchestrating arrivals and departures with strict queue priorities.',
        keyTakeaway: 'Mastering the core invariables allows you to solve both simple and highly complex edge cases.'
      });
      return;
    }

    const prompt = `Explain the academic concept "${topic}" for a ${level} college student.
Provide an intuitive explanation, a brilliant real-world analogy, and a memorable key takeaway.
Respond strictly in JSON:
{
  "concept": "${topic}",
  "explanation": "concise, deep explanation with clear technical accuracy",
  "analogy": "intuitive real-world analogy",
  "keyTakeaway": "one sentence golden rule to remember for exams"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = (response.text || '{}').trim();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = {
        concept: topic,
        explanation: raw,
        analogy: '',
        keyTakeaway: ''
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Explain error:', error);
    res.status(500).json({ error: error?.message || 'Failed to explain concept' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    aiAvailable: !!ai,
    timestamp: new Date().toISOString(),
    service: 'CampusConnect AI Server',
  });
});

// Mount Vite in dev mode or serve static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CampusConnect AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
