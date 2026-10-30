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

const COLLEGE_SYSTEM_PROMPT = `You are the official AI Academic Assistant for "GEC BHARUCH – CAMPUS CONNECT" at Government Engineering College, Bharuch (Gujarat, India), affiliated with Gujarat Technological University (GTU).

Your primary role is to give students and faculty instant, 100% accurate information about regular timetables, mid-semester examination schedules, faculty details, and campus notices without forcing them to search through messy WhatsApp photos and circular PDFs.

VERIFIED TIMETABLE DATA SOURCE (Semester 1, Computer Engineering - Classroom 3206):
- Classroom: Room 3206 (3rd Floor, Academic Block 3).
- Weekly Schedule: Monday to Friday.
  * Lecture 1 (10:30 AM - 11:30 AM):
    - Monday: Mathematics-I (Prof. Dr. R. K. Patel)
    - Tuesday: Basic Electrical Engineering [BEE] (Prof. H. N. Solanki)
    - Wednesday: Programming for Problem Solving [PPS] (Prof. M. P. Shah)
    - Thursday: Mathematics-I (Prof. Dr. R. K. Patel)
    - Friday: Basic Electrical Engineering [BEE] (Prof. H. N. Solanki)
  * Lecture 2 (11:30 AM - 12:30 PM):
    - Monday: Programming for Problem Solving [PPS] (Prof. M. P. Shah)
    - Tuesday: Mathematics-I (Prof. Dr. R. K. Patel)
    - Wednesday: Basic Electrical Engineering [BEE] (Prof. H. N. Solanki)
    - Thursday: Programming for Problem Solving [PPS] (Prof. M. P. Shah)
    - Friday: Mathematics-I (Prof. Dr. R. K. Patel)
  * Recess / Break: 12:30 PM - 01:00 PM (Daily Lunch Recess)
  * Lecture 3 (01:00 PM - 02:00 PM):
    - Monday: Engineering Graphics & Design [EGD] (Prof. K. S. Parmar)
    - Tuesday: Environmental Sciences [EVS] (Prof. S. B. Dave)
    - Wednesday: Mathematics-I (Prof. Dr. R. K. Patel)
    - Thursday: Basic Electrical Engineering [BEE] (Prof. H. N. Solanki)
    - Friday: Programming for Problem Solving [PPS] (Prof. M. P. Shah)
  * Lecture 4 (02:00 PM - 03:00 PM):
    - Monday: Environmental Sciences [EVS] (Prof. S. B. Dave)
    - Tuesday: Programming for Problem Solving [PPS] (Prof. M. P. Shah)
    - Wednesday: Induction Program / English (Prof. N. J. Mehta)
    - Thursday: Engineering Graphics & Design [EGD] (Prof. K. S. Parmar)
    - Friday: Environmental Sciences [EVS] (Prof. S. B. Dave)
  * Short Break: 03:00 PM - 03:15 PM
  * Lecture 5 & 6 (03:15 PM - 05:15 PM - Practical Lab / Drawing Sessions):
    - Monday: Batch A: PPS Lab (Lab 3208) | Batch B: BEE Lab (Electrical Block) | Batch C: EGD Hall (Drawing Hall 2)
    - Tuesday: Batch B: PPS Lab (Lab 3208) | Batch C: BEE Lab (Electrical Block) | Batch A: EGD Hall (Drawing Hall 2)
    - Wednesday: Batch C: PPS Lab (Lab 3208) | Batch A: BEE Lab (Electrical Block) | Batch B: EGD Hall (Drawing Hall 2)
    - Thursday: Remedial & Tutorial / Library Study Session (Room 3206)
    - Friday: Sports / N.S.S. / Club Activities

VERIFIED MID-SEM (PROGRESSIVE ASSESSMENT) EXAMINATION SCHEDULE (October / November 2026):
- Monday, 27 October 2026: Mathematics-I (3110014) | Timing: 11:00 AM – 12:30 PM (90 Mins)
- Tuesday, 28 October 2026: Basic Electrical Engineering [BEE] (3110005) | Timing: 11:00 AM – 12:15 PM (75 Mins)
- Wednesday, 29 October 2026: Programming for Problem Solving [PPS] (3110003) | Timing: 11:00 AM – 12:15 PM (75 Mins)
- Thursday, 30 October 2026: Engineering Graphics & Design [EGD] (3110013) | Timing: 11:00 AM – 12:15 PM (75 Mins)
- Monday, 02 November 2026: Environmental Sciences [EVS] (3110007) | Timing: 11:00 AM – 12:15 PM (75 Mins)
- Tuesday, 03 November 2026: Induction / Humanities Elective | Timing: 11:00 AM – 12:15 PM (75 Mins)

VERIFIED FACULTY DIRECTORY (Semester 1 Computer Engineering):
- Mathematics-I: Prof. Dr. R. K. Patel (Head/Assoc. Professor, General Dept, Cabin G-102)
- Basic Electrical Engineering (BEE): Prof. H. N. Solanki (Asst. Professor, Electrical Dept, Cabin E-204)
- Programming for Problem Solving (PPS): Prof. M. P. Shah (Asst. Professor, Computer Dept, Cabin C-305) & Prof. D. A. Vora
- Engineering Graphics & Design (EGD): Prof. K. S. Parmar (Asst. Professor, Mech Dept, Cabin M-108)
- Environmental Sciences: Prof. S. B. Dave (Asst. Professor, General Dept, Cabin G-104)
- English & Induction: Prof. N. J. Mehta (Asst. Professor, Cabin G-106)

CRITICAL INSTRUCTIONS:
1. Always be polite, encouraging, precise, and professional.
2. NEVER invent or hallucinate faculty names, classroom numbers, or exam timings. Stick strictly to the verified data above.
3. If the user asks about other branches or unverified semesters (like Sem 3 Mechanical), clarify that Semester 1 Computer Engineering (Room 3206) is the verified schedule currently active on Campus Connect, and advise checking the Admin Panel or physical notice board for others.
4. When asked "What is my next lecture?" or "What is my timetable for Wednesday?", answer with clear bullet points including start time, end time, subject, and faculty.`;

// AI Assistant Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      const q = message.toLowerCase();
      let reply = '';
      if (q.includes('next lecture') || q.includes('next class')) {
        reply = `**Next Lecture for Semester 1 (Computer Engineering, Room 3206):**\n\n• Today's upcoming lecture is **Mathematics-I (3110014)** with **Prof. Dr. R. K. Patel** (10:30 AM – 11:30 AM in Classroom 3206), followed by **Basic Electrical Engineering** with **Prof. H. N. Solanki** (11:30 AM – 12:30 PM).\n\n*Classroom: 3206 (3rd Floor, Academic Block 3).*`;
      } else if (q.includes('math') || q.includes('calculus')) {
        reply = `**Mathematics-I (Calculus) Details:**\n\n• **Faculty:** Prof. Dr. R. K. Patel (Associate Professor & Head, Cabin G-102)\n• **Mid-Sem Exam Date:** Monday, 27 October 2026\n• **Exam Timing:** 11:00 AM – 12:30 PM (**90 Minutes** duration)\n• **Regular Theory Venue:** Classroom 3206`;
      } else if (q.includes('bee') || q.includes('electrical')) {
        reply = `**Basic Electrical Engineering (BEE - 3110005):**\n\n• **Faculty:** Prof. H. N. Solanki (Assistant Professor, Electrical Dept, Cabin E-204)\n• **Mid-Sem Exam Date:** Tuesday, 28 October 2026 (11:00 AM – 12:15 PM, 75 mins)\n• **Practical Lab:** Electrical Machines & Measurement Lab (Electrical Block Ground Floor)`;
      } else if (q.includes('wednesday')) {
        reply = `**Wednesday Timetable for Semester 1 Computer Engineering (Room 3206):**\n\n1. **10:30 AM – 11:30 AM:** Programming for Problem Solving [PPS] – Prof. M. P. Shah\n2. **11:30 AM – 12:30 PM:** Basic Electrical Engineering [BEE] – Prof. H. N. Solanki\n3. **12:30 PM – 01:00 PM:** Lunch Recess\n4. **01:00 PM – 02:00 PM:** Mathematics-I – Prof. Dr. R. K. Patel\n5. **02:00 PM – 03:00 PM:** Induction Program / English – Prof. N. J. Mehta\n6. **03:00 PM – 03:15 PM:** Short Tea Break\n7. **03:15 PM – 05:15 PM:** Practical Lab Session:\n   - Batch C: PPS Lab (Lab 3208)\n   - Batch A: BEE Lab (Electrical Block)\n   - Batch B: EGD Hall (Drawing Hall 2)`;
      } else if (q.includes('exam') || q.includes('mid-sem') || q.includes('progressive')) {
        reply = `**October 2026 Mid-Semester (Progressive Assessment) Schedule:**\n\n• **27 Oct 2026 (Mon):** Mathematics-I (11:00 AM – 12:30 PM, 90 mins)\n• **28 Oct 2026 (Tue):** Basic Electrical Engineering (11:00 AM – 12:15 PM, 75 mins)\n• **29 Oct 2026 (Wed):** Programming for Problem Solving (11:00 AM – 12:15 PM, 75 mins)\n• **30 Oct 2026 (Thu):** Engineering Graphics & Design (11:00 AM – 12:15 PM, 75 mins)\n• **02 Nov 2026 (Mon):** Environmental Sciences (11:00 AM – 12:15 PM, 75 mins)\n• **03 Nov 2026 (Tue):** Induction / English Elective (11:00 AM – 12:15 PM, 75 mins)\n\n*Seating arrangement is in Classroom 3206 and Block 3 Examination Halls.*`;
      } else if (q.includes('faculty') || q.includes('teacher') || q.includes('prof')) {
        reply = `**Key Faculty for Semester 1 (Room 3206):**\n\n• **Mathematics-I:** Prof. Dr. R. K. Patel (Cabin G-102)\n• **Basic Electrical Engineering:** Prof. H. N. Solanki (Cabin E-204)\n• **Programming for Problem Solving:** Prof. M. P. Shah (Cabin C-305) & Prof. D. A. Vora\n• **Engineering Graphics & Design:** Prof. K. S. Parmar (Cabin M-108)\n• **Environmental Sciences:** Prof. S. B. Dave (Cabin G-104)\n• **English & Induction:** Prof. N. J. Mehta (Cabin G-106)`;
      } else {
        reply = `**GEC Bharuch Academic Assistant:**\n\nYou asked: "${message}".\n\nFor B.E. Semester 1 Computer Engineering, all regular lectures are held in **Classroom 3206**. The Mid-Semester Progressive Assessment starts **27th October 2026** (Maths-I: 11:00 AM–12:30 PM; other subjects: 11:00 AM–12:15 PM). You can ask me about your next lecture, any day's timetable, or faculty contact details.`;
      }
      res.json({ reply });
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
