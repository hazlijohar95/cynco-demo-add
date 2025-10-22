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
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
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
8. **EDIT AND MODIFY ACCOUNTING DATA** - You can add, update, and delete journal entries and opening balances when requested

TOOL USAGE:
- When user asks to "add", "record", "create" a transaction → use add_journal_entry tool
- When user asks to "update", "edit", "modify" an entry → use update_journal_entry tool
- When user asks to "delete", "remove" an entry → use delete_journal_entry tool
- When user asks to "set opening balance" → use add_opening_balance tool
- After using a tool, confirm what was done in natural language
- You can use multiple tools in sequence if needed

RESPONSE GUIDELINES:
- Be concise, professional, and use proper accounting terminology
- **Use Markdown formatting** to structure your responses:
  - Use **bold** for key terms and important numbers
  - Use bullet points (•) or numbered lists for clarity
  - Use \`code formatting\` for account codes and references
  - Use headings (##) to organize longer responses
  - Use tables when comparing numbers
- Always reference specific numbers, accounts, and dates when relevant
- If you notice errors or issues (like unbalanced books), **proactively mention them first**
- Format currency as USD with 2 decimal places
- When asked about balances, calculate from the provided data
- If data is missing or insufficient, explain what's needed
- Provide actionable recommendations when appropriate
- Keep responses under 200 words unless detailed explanation is requested
- **End responses with a relevant follow-up question** to keep conversation flowing

EXAMPLE RESPONSES:
Q: "What's my cash balance?"
A: "Your current **Cash (1011)** balance is **$XX,XXX.XX**.

### Recent Cash Activity:
• Received: $X,XXX from client payments
• Paid: $X,XXX for expenses

💡 Your cash position looks healthy. Would you like me to analyze your cash flow trends?"

USER CONTEXT:
The user is currently viewing: ${context.currentView}
They can see this data directly on their screen, so focus on interpreting and explaining rather than just repeating what they see.`;

    console.log('Calling Groq AI with context:', {
      messageLength: message.length,
      summaryEntries: context.summary.totalEntries,
      currentView: context.currentView,
    });

    // Define tools the AI can use to edit data
    const tools = [
      {
        type: "function",
        function: {
          name: "add_journal_entry",
          description: "Add a new journal entry with debit and credit transactions. Use this when user asks to record a transaction, add an entry, or post to accounts.",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
              account: { type: "string", description: "Account name or code" },
              debit: { type: "number", description: "Debit amount (0 if credit side)" },
              credit: { type: "number", description: "Credit amount (0 if debit side)" },
              description: { type: "string", description: "Transaction description" },
              reference: { type: "string", description: "Reference number or document ID" }
            },
            required: ["date", "account", "debit", "credit", "description", "reference"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "update_journal_entry",
          description: "Update an existing journal entry. Use when user asks to modify, edit, or correct an entry.",
          parameters: {
            type: "object",
            properties: {
              entryId: { type: "string", description: "The ID of the entry to update" },
              date: { type: "string", description: "New transaction date" },
              account: { type: "string", description: "New account name" },
              debit: { type: "number", description: "New debit amount" },
              credit: { type: "number", description: "New credit amount" },
              description: { type: "string", description: "New description" },
              reference: { type: "string", description: "New reference" }
            },
            required: ["entryId"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "delete_journal_entry",
          description: "Delete a journal entry. Use when user asks to remove or delete an entry.",
          parameters: {
            type: "object",
            properties: {
              entryId: { type: "string", description: "The ID of the entry to delete" }
            },
            required: ["entryId"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "add_opening_balance",
          description: "Add an opening balance for an account. Use when user wants to set initial balances.",
          parameters: {
            type: "object",
            properties: {
              account: { type: "string", description: "Account name or code" },
              debit: { type: "number", description: "Opening debit balance" },
              credit: { type: "number", description: "Opening credit balance" },
              date: { type: "string", description: "Date in YYYY-MM-DD format" }
            },
            required: ["account", "debit", "credit", "date"]
          }
        }
      }
    ];

    // Call Groq API with streaming (using Llama 3.3 70B - fast and powerful)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast inference speed with great quality
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory.slice(-10), // Last 10 messages for context
          { role: 'user', content: message }
        ],
        tools: tools,
        tool_choice: "auto", // Let the model decide when to use tools
        stream: true,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    // Handle errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Groq has high rate limits but please wait a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: 'Invalid Groq API key. Please check your GROQ_API_KEY secret.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    console.log('Streaming response from Groq AI');

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
