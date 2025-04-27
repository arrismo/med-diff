import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { report1, report2 } = await req.json();

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert medical report analyzer. Compare the two reports and identify discrepancies, focusing on clinical significance.',
        },
        {
          role: 'user',
          content: `Compare these two medical reports and identify any discrepancies:

Report 1:
${report1.content}

Report 2:
${report2.content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const analysis = response.choices[0].message.content;

    // Process the analysis to create a structured response
    const discrepancies = []; // Transform the analysis into structured discrepancies
    const summary = {
      totalDiscrepancies: discrepancies.length,
      bySeverity: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        informational: 0,
      },
      byType: {
        conflict: 0,
        missing: 0,
        rangeVariation: 0,
        terminologyDifference: 0,
      },
      clinicalImplications: analysis,
    };

    return new Response(
      JSON.stringify({
        discrepancies,
        summary,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});