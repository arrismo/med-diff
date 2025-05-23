import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';
import OpenAI from 'openai';

const sql = neon(process.env.NEON_DATABASE_URL!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const handler: Handler = async (event, context) => {
  console.log('[Compare Function] Handler started.');

  if (event.httpMethod === 'OPTIONS') {
    console.log('[Compare Function] Handling OPTIONS request.');
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' },
      body: 'ok',
    };
  }

  console.log('[Compare Function] Processing non-OPTIONS request.');

  try {
    console.log('[Compare Function] Parsing request body.');
    const { report1, report2 } = JSON.parse(event.body || '{}');
    console.log(`[Compare Function] Body parsed. Report 1 ID: ${report1?.id}, Report 2 ID: ${report2?.id}`);

    if (!report1 || !report2) {
      console.log('[Compare Function] Error: Missing reports in request.');
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' },
        body: JSON.stringify({ error: 'Both reports are required' }),
      };
    }

    console.log('[Compare Function] Calling OpenAI API.');
    const startTime = Date.now();
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a medical report analyzer. Compare these reports and identify discrepancies. Focus on:\n1. Different values for the same measurements (e.g., glucose levels, cholesterol, etc.)\n2. Different interpretations of the same values (e.g., one report says "high" while another says "normal")\n3. Different follow-up recommendations\n4. Missing values present in one report but not the other\n\nFor each discrepancy found, create a JSON object with:\n- A unique string ID\n- The type of discrepancy ("conflict" for different values/interpretations, "missing" for missing values)\n- A clear description of the difference\n- The severity ("critical" for clinically significant differences, "high" for important differences, "medium" for moderate differences)\n- The exact location in each report (character start/end positions, 0-based, inclusive start, exclusive end, matching the exact text provided above)\n- The exact phrase(s) from each report that you are referencing as "report1Text" and "report2Text" (if not present, set to null)\n- Clinical context explaining the significance\n- A suggestion for resolving the discrepancy\n\nIMPORTANT: Use the exact text provided above for calculating character positions. If you cannot find the exact phrase, set the location to null.\n\nReturn ONLY a JSON object with this exact structure:\n{\n  "discrepancies": [\n    {\n      "id": string,\n      "type": "conflict" | "missing",\n      "description": string,\n      "severity": "critical" | "high" | "medium" | "low",\n      "location": {\n        "report1Location": { "start": number, "end": number } | null,\n        "report2Location": { "start": number, "end": number } | null\n      },\n      "report1Text": string | null,\n      "report2Text": string | null,\n      "context": string,\n      "suggestion": string\n    }\n  ]\n}`
        },
        {
          role: 'user',
          content: `Compare these medical reports and identify all discrepancies:\n\nFirst Report:\n${report1.content}\n\nSecond Report:\n${report2.content}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1024,
    });
    const endTime = Date.now();
    console.log(`[Compare Function] OpenAI API call completed in ${endTime - startTime}ms.`);

    console.log('[Compare Function] Raw OpenAI response content:', response.choices[0].message.content);

    console.log('[Compare Function] Parsing OpenAI response.');
    const analysis = JSON.parse(response.choices[0].message.content!);
    console.log('[Compare Function] OpenAI response parsed.');

    function findTextLocation(content: string, phrase: string | null) {
      if (!phrase) return null;
      const start = content.indexOf(phrase);
      if (start === -1) return null;
      return { start, end: start + phrase.length };
    }
    function verifyLocation(content: string, location: { start: number; end: number } | null) {
      if (!location) return null;
      const { start, end } = location;
      if (typeof start !== 'number' || typeof end !== 'number' || start < 0 || end > content.length || start >= end) {
        return null;
      }
      return { start, end };
    }
    console.log('[Compare Function] Processing discrepancies.');
    const discrepancies = analysis.discrepancies.map((d: any) => ({
      ...d,
      location: {
        report1Location: d.report1Text
          ? findTextLocation(report1.content, d.report1Text)
          : verifyLocation(report1.content, d.location?.report1Location),
        report2Location: d.report2Text
          ? findTextLocation(report2.content, d.report2Text)
          : verifyLocation(report2.content, d.location?.report2Location)
      }
    }));
    console.log(`[Compare Function] Processed ${discrepancies.length} discrepancies.`);

    console.log('[Compare Function] Constructing comparison object.');
    const comparison = {
      id: `comparison-${Date.now()}`,
      timestamp: new Date().toISOString(),
      report1,
      report2,
      discrepancies,
      summary: {
        totalDiscrepancies: discrepancies.length,
        bySeverity: {
          critical: discrepancies.filter((d: any) => d.severity === 'critical').length,
          high: discrepancies.filter((d: any) => d.severity === 'high').length,
          medium: discrepancies.filter((d: any) => d.severity === 'medium').length,
          low: discrepancies.filter((d: any) => d.severity === 'low').length,
          informational: 0
        },
        byType: {
          conflict: discrepancies.filter((d: any) => d.type === 'conflict').length,
          missing: discrepancies.filter((d: any) => d.type === 'missing').length,
          rangeVariation: 0,
          terminologyDifference: 0
        }
      }
    };

    console.log('[Compare Function] Database interaction (optional) - currently commented out.');
    // Optionally, save to database here using sql if needed
    // await sql`INSERT INTO ...`;

    console.log('[Compare Function] Returning successful response.');
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' },
      body: JSON.stringify(comparison),
    };
  } catch (error: any) {
    console.error('[Compare Function] Error caught:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' },
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 