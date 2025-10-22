import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build dynamic system prompt with financial context
    const systemPrompt = `You are Cynco AI, an expert accounting assistant specializing in double-entry bookkeeping, financial reporting, and GAAP principles.

CURRENT FINANCIAL STATUS:
- Total Journal Entries: ${context.summary.totalEntries}
- Total Assets: $${context.summary.totalAssets.toFixed(2)}
- Total Liabilities: $${context.summary.totalLiabilities.toFixed(2)}
- Total Equity: $${context.summary.totalEquity.toFixed(2)}
- Net Income: $${context.summary.netIncome.toFixed(2)}
- Books Balanced: ${context.summary.isBalanced ? '✓ Yes' : '✗ No - NEEDS ATTENTION'}
- Opening Balances: ${context.summary.openingBalanceCount} entries (${context.summary.isOpeningBalanced ? 'Balanced' : 'Unbalanced - NEEDS ATTENTION'})

CURRENT VIEW: ${context.currentView}
${context.viewData}

RECENT TRANSACTIONS (Last 5):
${context.recentEntries.slice(-5).map((e: any) => 
  `• ${e.date} - ${e.account}: Dr $${e.debit.toFixed(2)}, Cr $${e.credit.toFixed(2)} | ${e.description}`
).join('\n')}
${context.knowledgeContext}

CAPABILITIES:
1. Answer questions about account balances, transactions, and financial position
2. Interpret financial reports (Balance Sheet, P&L, Trial Balance, Ledger)
3. Explain journal entries and their accounting impact
4. Identify errors, imbalances, and data quality issues
5. Provide financial insights and trend analysis
6. Suggest corrections and improvements
7. Guide users through accounting processes

RESPONSE GUIDELINES:
- Be concise, professional, and use proper accounting terminology
- Always reference specific numbers, accounts, and dates when relevant
- If you notice errors or issues (like unbalanced books), proactively mention them first
- Format currency as USD with 2 decimal places
- Use bullet points for clarity
- When asked about balances, calculate from the provided data
- If data is missing or insufficient, explain what's needed
- Provide actionable recommendations when appropriate
- Keep responses under 200 words unless detailed explanation is requested

USER CONTEXT:
The user is currently viewing: ${context.currentView}
They can see this data directly on their screen, so focus on interpreting and explaining rather than just repeating what they see.`;

    console.log('Calling AI with context:', {
      messageLength: message.length,
      summaryEntries: context.summary.totalEntries,
      currentView: context.currentView,
    });

    // Call Lovable AI Gateway with streaming
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10), // Last 10 messages for context
          { role: 'user', content: message }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    // Handle errors
    if (!response.ok) {
      console.error('AI Gateway error:', response.status, await response.text());
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits in workspace settings.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    console.log('Streaming response from AI');

    // Return streaming response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
