import express from 'express';
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

// Enable CORS with error handling
app.use((req, res, next) => {
  try {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  } catch (error) {
    console.error('CORS Error:', error);
    res.status(500).json({ error: 'Internal server error during CORS handling' });
  }
});

// Initialize Neon database connection
const sql = neon(process.env.NEON_DATABASE_URL);

// Initialize database schema
try {
  await sql`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      title TEXT,
      provider TEXT,
      date TEXT,
      content TEXT,
      patient_data TEXT,
      metadata TEXT
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS comparisons (
      id TEXT PRIMARY KEY,
      timestamp TEXT,
      report1_id TEXT,
      report2_id TEXT,
      discrepancies TEXT,
      summary TEXT,
      FOREIGN KEY (report1_id) REFERENCES reports(id),
      FOREIGN KEY (report2_id) REFERENCES reports(id)
    )
  `;
} catch (error) {
  console.error('Database Initialization Error:', error);
  process.exit(1);
}

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  console.error('Configuration Error: OPENAI_API_KEY is not set');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Compare reports endpoint
app.post('/api/compare', async (req, res) => {
  try {
    const { report1, report2 } = req.body;

    if (!report1 || !report2) {
      return res.status(400).json({ error: 'Both reports are required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a medical report analyzer. Compare these reports and identify discrepancies. Focus on:
1. Different values for the same measurements (e.g., glucose levels, cholesterol, etc.)
2. Different interpretations of the same values (e.g., one report says "high" while another says "normal")
3. Different follow-up recommendations
4. Missing values present in one report but not the other

For each discrepancy found, create a JSON object with:
- A unique string ID
- The type of discrepancy ("conflict" for different values/interpretations, "missing" for missing values)
- A clear description of the difference
- The severity ("critical" for clinically significant differences, "high" for important differences, "medium" for moderate differences)
- The exact location in each report (character start/end positions)
- Clinical context explaining the significance
- A suggestion for resolving the discrepancy

Return ONLY a JSON object with this exact structure:
{
  "discrepancies": [
    {
      "id": string,
      "type": "conflict" | "missing",
      "description": string,
      "severity": "critical" | "high" | "medium" | "low",
      "location": {
        "report1Location": { "start": number, "end": number } | null,
        "report2Location": { "start": number, "end": number } | null
      },
      "context": string,
      "suggestion": string
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Compare these medical reports and identify all discrepancies:

First Report:
${report1.content}

Second Report:
${report2.content}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2048,
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    const discrepancies = analysis.discrepancies;

    const comparison = {
      id: `comparison-${Date.now()}`,
      timestamp: new Date().toISOString(),
      report1,
      report2,
      discrepancies,
      summary: {
        totalDiscrepancies: discrepancies.length,
        bySeverity: {
          critical: discrepancies.filter(d => d.severity === 'critical').length,
          high: discrepancies.filter(d => d.severity === 'high').length,
          medium: discrepancies.filter(d => d.severity === 'medium').length,
          low: discrepancies.filter(d => d.severity === 'low').length,
          informational: 0
        },
        byType: {
          conflict: discrepancies.filter(d => d.type === 'conflict').length,
          missing: discrepancies.filter(d => d.type === 'missing').length,
          rangeVariation: 0,
          terminologyDifference: 0
        }
      }
    };

    // Save comparison to database
    try {
      await sql`
        INSERT INTO comparisons (id, timestamp, report1_id, report2_id, discrepancies, summary)
        VALUES (
          ${comparison.id},
          ${comparison.timestamp},
          ${comparison.report1.id},
          ${comparison.report2.id},
          ${JSON.stringify(comparison.discrepancies)},
          ${JSON.stringify(comparison.summary)}
        )
      `;
    } catch (dbError) {
      console.error('Database Error:', dbError);
    }

    res.json(comparison);
  } catch (error) {
    console.error('Error comparing reports:', error);
    res.status(500).json({ 
      error: 'Failed to compare reports',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});