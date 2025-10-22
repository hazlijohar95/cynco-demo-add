# Cynco Accounting

> A modern, AI-powered accounting application built with React, TypeScript, and Supabase

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📋 Overview

Cynco is a comprehensive accounting platform that combines traditional double-entry bookkeeping with AI assistance. It provides real-time financial insights, automated calculations, and intelligent data analysis through an intuitive interface.

### Key Features

- 🤖 **AI Assistant** - Powered by Groq's Llama 3.3 70B for intelligent financial analysis
- 📊 **Complete Accounting Suite** - Journal entries, ledger, trial balance, P&L, and balance sheet
- ⚡ **Real-time Calculations** - Instant updates across all financial statements
- 🎯 **Smart Tool Calling** - AI can directly modify accounting data through natural language
- 💾 **Local Storage** - Data persistence with automatic backups
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast development and optimized builds
- TailwindCSS for styling
- Shadcn UI components
- React Router for navigation

**Backend:**
- Supabase Edge Functions (Deno runtime)
- Groq AI API for language model inference
- Streaming responses for real-time AI interactions

**State Management:**
- React hooks with custom state management
- LocalStorage for data persistence
- History tracking for undo/redo functionality

### Project Structure

```
cynco-accounting/
├── src/
│   ├── components/          # React components
│   │   ├── chat/           # AI chat interface components
│   │   ├── spreadsheet/    # Financial spreadsheet components
│   │   └── ui/             # Reusable UI components (Shadcn)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic and API services
│   │   ├── aiTools.ts      # AI tool execution
│   │   └── financialCalculations.ts  # Accounting calculations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── pages/              # Page components
│   └── main.tsx            # Application entry point
├── supabase/
│   └── functions/          # Edge functions
│       └── ai-chat/        # AI chat endpoint
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase account (for backend functions)
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cynco-accounting.git
   cd cynco-accounting
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Configure Supabase secrets**
   
   In your Supabase dashboard, add the following secret:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

   The app will be available at `http://localhost:8080`

## 📚 Features Documentation

### Double-Entry Bookkeeping

Cynco implements complete double-entry accounting with:
- Journal entry recording
- Automatic ledger updates
- Trial balance verification
- Financial statement generation

### AI Assistant

The AI assistant can:
- Answer questions about financial data
- Analyze transactions and patterns
- Detect errors and imbalances
- Directly modify accounting records through natural language commands

**Example commands:**
```
"Add a journal entry for $500 office supplies expense"
"What's my current cash balance?"
"Analyze my business performance this month"
```

### Reports

#### Chart of Accounts
Hierarchical view of all accounts organized by type (Assets, Liabilities, Equity, Revenue, Expenses).

#### Balance Sheet
Real-time balance sheet showing:
- Assets (Current & Fixed)
- Liabilities (Current & Long-term)
- Equity
- Automatic balancing verification

#### Profit & Loss Statement
Income statement showing:
- Revenue breakdown by category
- Expense categorization
- Net income calculation
- Profit margin analysis

#### Trial Balance
Verification report ensuring:
- Total debits equal total credits
- All transactions are properly recorded
- Account balance accuracy

## 🔧 Configuration

### Customizing the Chart of Accounts

Edit `src/utils/chartOfAccounts.ts` to modify account structures:

```typescript
export const CHART_OF_ACCOUNTS = [
  {
    code: "1011",
    name: "Cash",
    type: "Asset",
    isParent: false,
  },
  // Add more accounts...
];
```

### AI Model Configuration

The AI assistant uses Groq's Llama 3.3 70B model. To change the model, edit `supabase/functions/ai-chat/index.ts`:

```typescript
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  // ...
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile', // Change model here
    // ...
  }),
});
```

## 🧪 Development

### Running Tests

```bash
npm test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📖 API Documentation

### Edge Functions

#### POST /functions/v1/ai-chat

Processes AI chat requests with streaming responses.

**Request Body:**
```json
{
  "message": "User message",
  "context": {
    "summary": { /* Financial summary */ },
    "currentView": "journal",
    "recentEntries": [ /* Recent transactions */ ]
  },
  "conversationHistory": [ /* Previous messages */ ]
}
```

**Response:**
Server-Sent Events (SSE) stream with:
- Streaming text content
- Tool call executions
- Error messages

### AI Tools

The AI can execute the following tools:

#### add_journal_entry
```typescript
{
  date: "YYYY-MM-DD",
  account: "Account name",
  debit: number,
  credit: number,
  description: "Transaction description",
  reference: "Reference number"
}
```

#### update_journal_entry
```typescript
{
  entryId: "entry_id",
  // Fields to update
}
```

#### delete_journal_entry
```typescript
{
  entryId: "entry_id"
}
```

#### add_opening_balance
```typescript
{
  account: "Account name",
  debit: number,
  credit: number,
  date: "YYYY-MM-DD"
}
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

### Data Privacy
- All data is stored locally in the browser's LocalStorage
- No financial data is sent to third-party services except AI queries
- AI queries are anonymized and don't include personally identifiable information

### API Keys
- Never commit API keys to the repository
- Use environment variables for all sensitive configuration
- Rotate API keys regularly

## 🐛 Troubleshooting

### Common Issues

**AI Assistant not responding:**
- Check that GROQ_API_KEY is properly configured in Supabase
- Verify edge function is deployed and running
- Check browser console for errors

**Data not persisting:**
- Ensure LocalStorage is enabled in your browser
- Check browser storage quota
- Try clearing site data and reloading

**Calculations incorrect:**
- Verify all journal entries have either debit or credit (not both)
- Check that debits equal credits for each transaction
- Review opening balances for accuracy

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation thoroughly before reporting bugs

## 📚 Additional Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [API Documentation](docs/API.md)

---

**Built with ❤️ for accountants and developers**
