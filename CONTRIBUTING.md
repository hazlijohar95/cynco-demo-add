# Contributing to Cynco Accounting

Thank you for your interest in contributing to Cynco! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Standards

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards other contributors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git
- Code editor (VS Code recommended)
- Basic understanding of React, TypeScript, and accounting principles

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/cynco-accounting.git
   cd cynco-accounting
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/cynco-accounting.git
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Create a `.env` file with required variables (see README.md)

6. Start the development server:
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## 📝 Coding Standards

### TypeScript

- **Always use TypeScript** - No `.js` files
- Define types for all props and function parameters
- Avoid `any` type - use `unknown` if type is uncertain
- Use interfaces for object shapes
- Use type aliases for unions and primitives

**Example:**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User {
  // Implementation
}

// ❌ Bad
function getUser(id: any): any {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Prefer named exports over default exports
- Keep components small and focused (< 200 lines)
- Extract complex logic into custom hooks
- Use proper prop destructuring

**Example:**
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
};

// ❌ Bad
export default (props: any) => {
  return <button onClick={props.onClick}>{props.label}</button>;
};
```

### File Organization

```
src/
├── components/
│   ├── ComponentName/
│   │   ├── ComponentName.tsx
│   │   ├── ComponentName.test.tsx
│   │   └── index.ts
├── hooks/
│   ├── useHookName.ts
│   └── useHookName.test.ts
├── services/
│   ├── serviceName.ts
│   └── serviceName.test.ts
└── types/
    └── index.ts
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`calculateBalance.ts`)
- **Types**: PascalCase (`UserProfile`, `JournalEntry`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ENTRIES`)

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings (except JSX)
- Max line length: 100 characters
- Use trailing commas

**Prettier Config:**
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions and components
- Explain "why" not "what"

**Example:**
```typescript
/**
 * Calculate the net income from revenue and expenses.
 * 
 * @param revenue - Total revenue for the period
 * @param expenses - Total expenses for the period
 * @returns Net income (profit or loss)
 */
export const calculateNetIncome = (revenue: number, expenses: number): number => {
  return revenue - expenses;
};
```

## 🧪 Testing Guidelines

### Test Structure

- Unit tests for utilities and services
- Component tests for UI components
- Integration tests for complex workflows
- Minimum 80% code coverage for new code

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { calculateNetIncome } from './financialCalculations';

describe('calculateNetIncome', () => {
  it('should calculate positive net income', () => {
    expect(calculateNetIncome(1000, 600)).toBe(400);
  });

  it('should calculate negative net income (loss)', () => {
    expect(calculateNetIncome(500, 800)).toBe(-300);
  });

  it('should handle zero values', () => {
    expect(calculateNetIncome(0, 0)).toBe(0);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch** with the latest changes from `main`
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** and ensure they pass
   ```bash
   npm test
   ```

3. **Run linter** and fix any issues
   ```bash
   npm run lint
   ```

4. **Build the project** to check for errors
   ```bash
   npm run build
   ```

### Submitting a PR

1. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template completely:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if UI changes)

4. Request review from maintainers

### PR Requirements

- ✅ All tests passing
- ✅ No linting errors
- ✅ Code follows style guidelines
- ✅ Documentation updated (if needed)
- ✅ Meaningful commit messages
- ✅ No merge conflicts

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(ai): add support for batch journal entry creation

Implement ability to create multiple journal entries from a single AI command.
Includes validation and error handling for batch operations.

Closes #123
```

```bash
fix(calculations): correct net income calculation for equity accounts

Previously, equity accounts were incorrectly included in net income calculation.
Updated the logic to exclude equity accounts from P&L calculations.
```

```bash
docs(readme): update installation instructions

Add detailed steps for setting up Groq API key and configuring Supabase.
```

## 🎯 Areas for Contribution

### High Priority

- [ ] Unit tests for financial calculations
- [ ] Integration tests for AI tools
- [ ] Mobile responsive improvements
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Performance optimizations

### Medium Priority

- [ ] Additional AI capabilities
- [ ] Export functionality (PDF, CSV)
- [ ] Multi-currency support
- [ ] Dark mode improvements

### Good First Issues

Look for issues tagged with `good-first-issue` - these are great starting points for new contributors!

## 📞 Questions?

If you have questions:
- Check existing issues and discussions
- Join our community discussions on GitHub
- Reach out to maintainers

Thank you for contributing to Cynco! 🎉
