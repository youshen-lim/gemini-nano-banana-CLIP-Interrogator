# Contributing to Gemini nano-banana CLIP Interrogator

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Quick Start

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gemini-nano-banana-CLIP-Interrogator.git
   cd gemini-nano-banana-CLIP-Interrogator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env.local
   # Add your Gemini API key to .env.local
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test        # Watch mode
   npm run test:run # Single run
   ```

## 🔄 Pull Request Process

### Before You Start
- Check existing issues and PRs to avoid duplicates
- Create an issue to discuss major changes
- Fork the repository and create a feature branch

### Making Changes
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style and patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   npm run test:run    # All tests must pass
   npm run build       # Build must succeed
   npm run lint        # Code must pass linting
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   Use [Conventional Commits](https://conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `test:` for tests
   - `refactor:` for code refactoring

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

### PR Requirements
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Code follows project style
- ✅ Includes tests for new features
- ✅ Updates documentation if needed
- ✅ Clear PR description explaining changes

## 📋 Code Style Guidelines

### TypeScript/React
- Use TypeScript for all new code
- Follow existing component patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer functional components with hooks

### Testing
- Write tests for all new features
- Maintain test coverage above 90%
- Use descriptive test names
- Test both happy path and error cases

### File Organization
```
components/          # React components
├── ActionButton.tsx
├── ErrorDisplay.tsx
└── ...
services/           # Business logic and API calls
├── geminiService.ts
└── ...
src/test/          # Test files
├── *.test.tsx
└── ...
```

## 🐛 Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.yml) and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser and environment details
- Screenshots if applicable

## 💡 Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml) and include:
- Clear description of the feature
- Problem it solves
- How you would use it
- Any alternatives considered

## 🔒 Security

- Never commit API keys or sensitive data
- Report security vulnerabilities privately via GitHub Security Advisories
- Use environment variables for configuration

## 📞 Getting Help

- 💬 [GitHub Discussions](../../discussions) for questions
- 🐛 [Issues](../../issues) for bugs and feature requests
- 📧 Email maintainers for private matters

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors graph

Thank you for contributing! 🚀
