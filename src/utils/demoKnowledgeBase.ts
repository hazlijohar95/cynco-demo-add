import { KnowledgeEntry } from "@/types";

/**
 * Generate demo knowledge base entries for TechConsult Solutions LLC
 * Provides business context for the demo
 */
export const generateDemoKnowledge = (): KnowledgeEntry[] => {
  const baseDate = new Date('2024-01-01');
  
  return [
    {
      id: '1',
      category: 'Company Profile',
      title: 'TechConsult Solutions LLC - Overview',
      content: `**Business Information**

• **Company Name:** TechConsult Solutions LLC
• **Founded:** November 2023
• **Industry:** Technology Consulting & Development
• **Location:** San Francisco, CA
• **Services:** 
  - Custom web application development
  - Mobile app development (iOS & Android)
  - API integration & development
  - E-commerce platform solutions
  - Technology consulting

**Team Structure:**
• Owner/CEO: 1
• Senior Developers: 2
• UX/UI Designer: 1

**Business Model:**
• Project-based pricing
• 50% deposit on project start
• 50% balance on completion
• 30-day payment terms on final invoices`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      category: 'Accounting Policies',
      title: 'Chart of Accounts Structure',
      content: `**Account Numbering System**

**1000-1999: Assets**
• 1011: Cash (Operating Account - First National Bank)
• 1020: Accounts Receivable
• 1040: Prepaid Expenses
• 1110: Office Equipment
• 1140: Accumulated Depreciation

**2000-2999: Liabilities**
• 2011: Accounts Payable
• 2020: Notes Payable

**3000-3999: Equity**
• 3010: Owner's Capital
• 3020: Retained Earnings
• 3030: Owner's Drawings

**4000-4999: Revenue**
• 4010: Service Revenue
• 4030: Interest Income

**6000-6999: Expenses**
• 6110: Salaries & Wages
• 6210: Rent Expense
• 6220: Utilities
• 6230: Marketing & Advertising
• 6240: Professional Fees
• 6310: Office Supplies
• 6920: Depreciation Expense
• 6930: Interest Expense
• 6940: Bad Debt Expense
• 6950: Bank Fees`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      category: 'Revenue Recognition',
      title: 'Revenue Recognition Policy',
      content: `**Project Billing Process**

**Invoice Timing:**
1. **Project Start:** Invoice 50% deposit
   - Due immediately
   - Must be received before work begins
   
2. **Project Completion:** Invoice 50% balance
   - Invoiced upon final delivery
   - 30-day payment terms

**Revenue Recognition:**
• Revenue recognized when invoice is issued
• Based on percentage of completion method
• Final reconciliation upon project completion

**Outstanding Invoices:**
• Follow-up at 15 days overdue
• Second notice at 30 days
• Collection action at 60 days

**Bad Debt:**
• Assessed quarterly
• Write-off requires owner approval`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      category: 'Expense Management',
      title: 'Expense Approval & Recording Policy',
      content: `**Approval Limits:**
• Under $500: Manager approval required
• $500 - $5,000: Owner approval required
• Over $5,000: Owner + board approval

**Documentation Requirements:**
• All expenses require receipts/invoices
• Business purpose must be documented
• Credit card statements reconciled monthly

**Recurring Expenses:**
• **Rent:** $3,000/month (prepaid quarterly)
• **Utilities:** ~$600/month (varies)
• **Software/SaaS:** $200-400/month
• **Payroll:** ~$18,000/month (3 employees)

**Reimbursements:**
• Submitted within 30 days
• Approved within 7 days
• Paid with next payroll cycle`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      category: 'Banking',
      title: 'Bank Reconciliation Procedures',
      content: `**Bank Account Information**
• **Bank:** First National Bank
• **Account Type:** Business Checking
• **Account Number:** ****1234
• **Online Access:** Yes

**Reconciliation Schedule:**
• **Frequency:** Monthly
• **Due Date:** 5th of following month
• **Responsible:** Owner/Bookkeeper

**Reconciliation Process:**
1. Download bank statement (1st-last day of month)
2. Match deposits with receivables
3. Match checks with payables
4. Identify bank fees, interest, NSF checks
5. Create adjustment journal entries
6. Verify reconciliation balances
7. Document discrepancies
8. File reconciliation report

**Common Discrepancies:**
• Outstanding checks (timing)
• Deposits in transit (timing)
• Bank fees (monthly $35 + transaction fees)
• Interest income (minimal)
• NSF checks (rare but possible)`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '6',
      category: 'Assets',
      title: 'Fixed Assets & Depreciation Policy',
      content: `**Depreciation Method:** Straight-Line

**Asset Categories:**

**Office Equipment (5-year life):**
• Desks, chairs, furniture
• Printers, scanners
• Annual depreciation: 20%
• Monthly: 1.67%

**Computer Equipment (3-year life):**
• Laptops, desktops
• Servers, monitors
• Annual depreciation: 33.33%
• Monthly: 2.78%

**Capitalization Threshold:**
• Items over $1,000
• Useful life > 1 year

**Recording:**
• Depreciation recorded monthly
• Accumulated depreciation contra-asset account
• Review annually for impairment

**Current Equipment:**
• 3 MacBook Pro laptops ($4,500 each)
• Standing desks + ergonomic chairs ($3,500)
• Server equipment ($8,000)
• Monitors and peripherals ($2,500)

**Total Equipment Cost:** $27,500
**Estimated Monthly Depreciation:** ~$625`,
      type: 'text',
      createdAt: baseDate.toISOString()
    },
    {
      id: '7',
      category: 'Clients',
      title: 'Active Client List - Q1 2024',
      content: `**Current Projects:**

**ABC Corp - Website Redesign**
• Project Value: $25,000
• Timeline: 6 weeks
• Status: Completed (paid in full)
• Contact: Sarah Chen, CTO

**XYZ Ltd - Mobile App Development**
• Project Value: $42,000
• Timeline: 10 weeks
• Status: Completed
• Payment: Received in full
• Contact: Michael Torres, Product Manager

**FinTech Inc - API Integration**
• Project Value: $35,000
• Timeline: 8 weeks
• Status: In Progress
• Payment: 50% deposit received
• Contact: Jennifer Wong, Engineering Lead

**RetailCo - E-commerce Platform**
• Project Value: $28,000
• Timeline: 12 weeks
• Status: In Progress
• Payment: Not yet invoiced
• Contact: David Kim, Operations Director

**Prospective Clients:**
• HealthTech Startup (discussing scope)
• Manufacturing Company (RFP submitted)
• Real Estate Platform (proposal stage)`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '8',
      category: 'Financial Goals',
      title: '2024 Financial Objectives',
      content: `**Q1 2024 Targets:**
• Revenue: $150,000 ✅ (achieved $138,500)
• Net Margin: 25%+ ✅ (achieved 28%)
• Client Acquisition: 5 new clients ✅ (5 signed)
• Receivables < 45 days ⚠️ (working on collections)

**Annual 2024 Goals:**
• Revenue Target: $750,000
• Net Profit: $200,000
• Team Expansion: +2 developers by Q3
• New Office: Move to larger space by Q4
• Debt Reduction: Pay off $25,000 note by EOY

**Key Metrics to Track:**
• Monthly revenue growth rate
• Average project value
• Client retention rate
• Utilization rate (billable hours)
• Operating expense ratio
• Cash flow position

**Risk Management:**
• Maintain 3-month operating reserve
• Diversify client base (no client > 30% revenue)
• Professional liability insurance maintained
• Regular financial statement review`,
      type: 'text',
      createdAt: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};
