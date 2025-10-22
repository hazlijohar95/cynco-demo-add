# Architecture Documentation

## System Overview

Cynco Accounting is a client-side React application with serverless backend functions. The architecture emphasizes real-time calculations, AI integration, and data persistence through browser storage.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             React Application (SPA)                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐   │  │
│  │  │  UI Layer  │  │  Services  │  │    Hooks    │   │  │
│  │  └─────┬──────┘  └──────┬─────┘  └──────┬──────┘   │  │
│  │        │                │                │           │  │
│  │        └────────────────┴────────────────┘           │  │
│  │                         │                             │  │
│  │              ┌──────────┴──────────┐                 │  │
│  │              │   State Management  │                 │  │
│  │              └──────────┬──────────┘                 │  │
│  │                         │                             │  │
│  │              ┌──────────┴──────────┐                 │  │
│  │              │   LocalStorage      │                 │  │
│  │              └─────────────────────┘                 │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │ HTTPS/WebSocket
                          │
         ┌────────────────┴────────────────┐
         │                                  │
    ┌────▼─────┐                    ┌──────▼──────┐
    │ Supabase │                    │   Groq AI   │
    │   Edge   │────────────────────▶  (Llama 3.3) │
    │ Functions│                    └─────────────┘
    └──────────┘
```

## Component Architecture

### Frontend Layers

#### 1. Presentation Layer
- **Components**: Reusable UI components (Shadcn UI)
- **Pages**: Top-level route components
- **Layouts**: Application shell and navigation

#### 2. Business Logic Layer
- **Services**: Core business logic
  - `financialCalculations.ts`: Accounting calculations
  - `aiTools.ts`: AI tool execution
- **Hooks**: Reusable stateful logic
  - `useAIChat.ts`: AI chat management
  - `useLocalStorage.ts`: Data persistence
  - `useHistory.ts`: Undo/redo functionality

#### 3. Data Layer
- **Types**: TypeScript type definitions
- **State**: React state + LocalStorage
- **API**: Edge function communication

## Data Flow

### User Interaction Flow

```
User Action
    │
    ▼
UI Component
    │
    ├──▶ Local State Update ──▶ UI Re-render
    │
    ├──▶ Service Call ──▶ Calculation ──▶ State Update
    │
    └──▶ API Call ──▶ Edge Function ──▶ AI Processing ──▶ Response Stream
                                            │
                                            ▼
                                     Tool Execution ──▶ Data Modification
```

### AI Chat Flow

```
User Message
    │
    ▼
useAIChat Hook
    │
    ├──▶ Generate Context (Financial Data)
    │
    ├──▶ Call Edge Function (/ai-chat)
    │         │
    │         ▼
    │    Edge Function (Deno)
    │         │
    │         ├──▶ Call Groq API
    │         │         │
    │         │         ▼
    │         │    Llama 3.3 70B
    │         │         │
    │         │         └──▶ Streaming Response
    │         │                  │
    │         └──────────────────┘
    │
    ├──▶ Process Stream (SSE)
    │         │
    │         ├──▶ Text Content ──▶ Update Chat UI
    │         │
    │         └──▶ Tool Calls ──▶ AIToolExecutor
    │                                   │
    │                                   ├──▶ add_journal_entry
    │                                   ├──▶ update_journal_entry
    │                                   ├──▶ delete_journal_entry
    │                                   └──▶ add_opening_balance
    │
    └──▶ Update State ──▶ Save to LocalStorage
```

## Key Design Patterns

### 1. Service Layer Pattern

Separates business logic from UI components.

```typescript
// Service handles complex calculations
export const calculateNetIncome = (
  revenue: number,
  expenses: number
): number => {
  return revenue - expenses;
};

// Component uses service
import { calculateNetIncome } from '@/services/financialCalculations';

const netIncome = calculateNetIncome(totalRevenue, totalExpenses);
```

### 2. Custom Hooks Pattern

Encapsulates stateful logic for reuse.

```typescript
export const useAIChat = (props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sendMessage = async (content: string) => {
    // Complex logic here
  };
  
  return { sendMessage, isProcessing };
};
```

### 3. Tool Executor Pattern

AI tools are executed through a dedicated executor class.

```typescript
const toolExecutor = new AIToolExecutor(
  setJournalEntries,
  setOpeningBalances,
  setActiveView
);

await toolExecutor.executeTool('add_journal_entry', args);
```

### 4. State Management

Uses React hooks + LocalStorage for persistence.

```typescript
const [data, setData] = useLocalStorage<T>('key', defaultValue);
// Automatically syncs with LocalStorage
```

## Accounting Logic

### Double-Entry Bookkeeping

```
Every Transaction:
    Debit(s) = Credit(s)

Account Balance = Opening Balance + Σ(Debits - Credits)
```

### Financial Statements Calculation

#### Balance Sheet
```
Assets = Liabilities + Equity + Net Income

Where:
- Assets = Σ(Asset Account Balances)
- Liabilities = Σ(Liability Account Balances)  
- Equity = Σ(Equity Account Balances)
- Net Income = Total Revenue - Total Expenses
```

#### Profit & Loss
```
Net Income = Total Revenue - Total Expenses

Where:
- Revenue = Σ(Revenue Account Balances)
- Expenses = Σ(Expense Account Balances)
```

#### Trial Balance
```
Total Debits = Total Credits

Verified by:
Σ(All Debit Entries) = Σ(All Credit Entries)
```

## AI Integration

### Tool Calling Architecture

The AI uses function calling to execute actions:

1. **Tool Definition**: Tools are defined in edge function
2. **AI Decision**: LLM decides when to call tools
3. **Streaming**: Tool calls stream back via SSE
4. **Execution**: Frontend executes tools locally
5. **Confirmation**: Results sent back to AI for natural language confirmation

### Context Generation

Financial context is generated before each AI request:

```typescript
{
  summary: {
    totalAssets,
    totalLiabilities,
    totalEquity,
    netIncome,
    isBalanced
  },
  currentView: "journal" | "balance-sheet" | ...,
  viewData: "Formatted view-specific data",
  recentEntries: [...],
  knowledgeContext: "Relevant knowledge base entries"
}
```

## Performance Considerations

### Optimizations

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Lazy Loading**: Components loaded on demand
3. **Debouncing**: Input handlers debounced
4. **Virtual Scrolling**: Large lists use virtual scrolling
5. **LocalStorage**: Async operations batched

### Bundle Size

- Main bundle: ~500KB (gzipped)
- Code splitting by route
- Lazy-loaded components
- Tree-shaking enabled

## Security Architecture

### Data Security

- No server-side data storage (except temporary AI context)
- All financial data in browser LocalStorage
- API keys stored as environment variables/secrets
- No sensitive data in logs

### API Security

- Edge functions use API key authentication
- CORS configured for specific origins
- Rate limiting on edge functions
- Input validation on all endpoints

## Scalability Considerations

### Current Limitations

- LocalStorage size limit (~10MB)
- Single-user application
- No multi-device sync

### Future Scalability

To scale beyond current architecture:

1. **Database**: Add Supabase database for persistence
2. **Authentication**: Implement user authentication
3. **Multi-tenancy**: Separate data by user
4. **Real-time Sync**: Use Supabase Realtime
5. **File Storage**: Add Supabase Storage for documents

## Error Handling

### Error Boundaries

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### API Error Handling

```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error) {
  toast.error(error.message);
  // Log error
  // Retry logic
}
```

### Graceful Degradation

- AI unavailable → Show cached responses
- LocalStorage full → Warn user, offer export
- Network error → Queue for retry

## Testing Strategy

### Unit Tests
- Pure functions (calculations, utilities)
- Individual components
- Hooks

### Integration Tests
- User workflows
- AI tool execution
- State management

### E2E Tests
- Critical user paths
- AI interactions
- Data persistence

## Deployment

### Build Process

```bash
npm run build
│
├── TypeScript compilation
├── Asset optimization
├── Code splitting
├── Bundle compression
└── Generate dist/
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxx
```

### Edge Function Deployment

Edge functions are deployed to Supabase automatically with proper configuration in `supabase/config.toml`.

## Monitoring & Observability

### Logging

- Console logs in development
- Error tracking in production
- Performance metrics
- User analytics (anonymized)

### Metrics to Track

- Page load time
- AI response time
- LocalStorage usage
- Error rates
- User engagement

## Future Architecture Enhancements

1. **Microservices**: Split edge functions by domain
2. **Event Sourcing**: Track all changes as events
3. **CQRS**: Separate read/write models
4. **Caching**: Add Redis for AI context caching
5. **Queue System**: Background processing for heavy tasks

---

*This architecture is designed to be simple, maintainable, and scalable. It prioritizes developer experience and user performance.*
