# Contributing to HTML to Vue Converter

First off, thank you for considering contributing to HTML to Vue Converter! 🎉

It's people like you that make this tool better for everyone. This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and constructive.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them get started
- ✅ Accept constructive criticism gracefully
- ✅ Focus on what's best for the community
- ❌ No harassment, trolling, or insulting comments
- ❌ No spam or off-topic discussions

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, please include:**

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** (if applicable)
- **Environment details**:
  - OS (macOS, Windows, Linux)
  - Browser and version
  - Node.js version
  - Package versions

**Example Bug Report:**

```markdown
**Bug**: Converter fails with nested arrow functions

**Steps to Reproduce:**

1. Paste HTML with nested arrow function
2. Select Composition API
3. Click convert

**Expected:** Should convert nested functions properly
**Actual:** Returns error message

**Environment:**

- OS: macOS 14.0
- Node: 20.10.0
- Browser: Chrome 120
```

### Suggesting Features

We love feature suggestions! Please provide:

- **Clear use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: What other approaches did you think about?
- **Examples**: Show mockups or code examples if possible

### Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples for complex features
- Improve code comments
- Translate documentation (future)

### Submitting Code

1. **Find or create an issue** to discuss the change
2. **Fork the repository**
3. **Create a feature branch**
4. **Make your changes**
5. **Write/update tests**
6. **Submit a pull request**

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn or pnpm
- Git

### Local Setup

```bash
# 1. Fork the repository on GitHub (click the "Fork" button)

# 2. Clone YOUR fork (replace YOUR_USERNAME with your GitHub username)
git clone https://github.com/YOUR_USERNAME/html_vue_converter.git
cd html_vue_converter

# 3. Create a new branch for your changes
git switch -c <branch-name>

# 4. Install dependencies
npm install

# 5. Run development server
npm run dev

# 6. Run tests
npm test

# 7. Run tests in watch mode (recommended during development)
npm test -- --watch

# 8. After making changes, commit and push
git add .
git commit -m "your commit message"
git push origin <branch-name>

# 9. Create a Pull Request on GitHub
```

### Project Structure

```
app/
├── components/     # Vue components
├── pages/          # Page components
├── utils/          # Utility functions
│   ├── convert.ts       # Core conversion logic
│   ├── convert.test.ts  # Tests
│   └── test-files/      # Test fixtures
└── assets/         # Static assets
```

### Key Files

- **`app/utils/convert.ts`**: Core HTML → Vue conversion logic
- **`app/utils/convert.test.ts`**: Comprehensive test suite
- **`app/pages/index.vue`**: Main converter UI
- **`app/components/CodeEditor.vue`**: Code editor component

## 🔄 Pull Request Process

### Before Submitting

- [ ] Update/add tests for your changes
- [ ] Run tests: `npm test`
- [ ] Update documentation if needed
- [ ] Follow the code style guidelines
- [ ] Commit message follows our guidelines

### PR Guidelines

1. **Keep PRs focused**: One feature/fix per PR
2. **Write descriptive titles**: "Add support for Vue 2 conversion"
3. **Describe your changes**: What, why, and how
4. **Link related issues**: "Fixes #123" or "Relates to #456"
5. **Request review**: Tag relevant maintainers
6. **Be responsive**: Address feedback promptly

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe how you tested your changes

## Checklist

- [ ] Tests pass locally
- [ ] New tests added (if applicable)
- [ ] Documentation updated
- [ ] Code follows style guidelines
```

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types that might be reused

```typescript
// ✅ Good
interface ConversionOptions {
  apiStyle: "composition" | "options";
  preserveComments?: boolean;
}

function convert(html: string, options: ConversionOptions): string {
  // ...
}

// ❌ Avoid
function convert(html: any, options: any): any {
  // ...
}
```

### Vue Components

- Use `<script setup>` for new components
- Define prop types with TypeScript
- Use composables for reusable logic
- Keep components focused and small

```vue
<!-- ✅ Good -->
<script setup lang="ts">
interface Props {
  code: string;
  language: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  update: [code: string];
}>();
</script>
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multiline objects/arrays
- Use meaningful variable names
- Add comments for complex logic

```typescript
// ✅ Good
const parseHTML = (html: string): ParsedHTML => {
  // Remove DOCTYPE and meta tags
  const cleanHTML = html
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<meta[^>]*\/?>/gi, "");

  return {
    template: extractTemplate(cleanHTML),
    scripts: extractScripts(cleanHTML),
    styles: extractStyles(cleanHTML),
  };
};
```

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

```typescript
// ✅ Good test structure
describe("HTML to Vue Converter", () => {
  describe("Script Conversion", () => {
    it("should convert variables to refs in Composition API", () => {
      // Arrange
      const html = readTestFile("with-script.html");

      // Act
      const result = convert(html, "composition");

      // Assert
      expect(result).toContain("const count = ref(0)");
      expect(result).toContain("import { ref } from 'vue'");
    });
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Focus on critical paths
- Don't test implementation details
- Test behavior, not internals

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (during development)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Run specific test file
npm test convert.test.ts
```

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
feat(converter): add support for Vue 2 conversion

# Bug fix
fix(parser): handle nested arrow functions correctly

# Documentation
docs(readme): update installation instructions

# Tests
test(converter): add tests for edge cases

# Refactor
refactor(utils): simplify HTML parsing logic
```

### Best Practices

- Use present tense: "add feature" not "added feature"
- Keep subject line under 50 characters
- Capitalize first letter
- No period at the end
- Reference issues: "fixes #123"

## 🎯 Areas to Contribute

Looking for ideas? Here are some areas that need help:

### High Priority

- [ ] Better error messages and validation
- [ ] Support for more HTML patterns
- [ ] Performance optimization for large files
- [ ] Better event listener conversion

### Medium Priority

- [ ] VS Code extension
- [ ] Batch file conversion
- [ ] Export as .vue file feature
- [ ] Dark mode

### Low Priority

- [ ] Additional themes for code editor
- [ ] Keyboard shortcuts
- [ ] Mobile responsive improvements

## ❓ Questions?

- 💬 Join discussions in GitHub Discussions
- 🐛 Report issues on GitHub Issues
- 📧 Contact maintainers (add contact info)

## 🙏 Recognition

Contributors will be:

- Listed in README.md
- Credited in release notes
- Mentioned in the Contributors section

Thank you for contributing! 🎉
