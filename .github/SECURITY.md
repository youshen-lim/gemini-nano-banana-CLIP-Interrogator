# Security Policy

## 🛡️ Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## 🚨 Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### 📧 Private Reporting (Preferred)

1. **GitHub Security Advisories** (Recommended)
   - Go to the [Security tab](../../security/advisories) of this repository
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email** (Alternative)
   - Send details to: [your-email@domain.com]
   - Use subject: "Security Vulnerability - Gemini CLIP Interrogator"

### ⚠️ Please DO NOT:
- Open public issues for security vulnerabilities
- Discuss vulnerabilities in public forums
- Share exploit code publicly before we've had time to fix it

## 🔒 Security Best Practices

### For Users
- **API Keys**: Never share your Gemini API keys
- **Environment Variables**: Store API keys in `.env.local` (never commit to git)
- **HTTPS**: Always use HTTPS when deploying
- **Updates**: Keep dependencies updated

### For Contributors
- **Dependencies**: Run `npm audit` before submitting PRs
- **Secrets**: Never commit API keys, tokens, or passwords
- **Input Validation**: Validate all user inputs
- **Error Handling**: Don't expose sensitive information in error messages

## 🛠️ Security Features

This application implements several security measures:

### ✅ Implemented
- **Secret Scanning**: GitHub automatically scans for committed secrets
- **Dependabot**: Automated dependency vulnerability alerts
- **CodeQL Analysis**: Static code analysis for security issues
- **Input Validation**: File type and size validation for uploads
- **API Key Protection**: Client-side API key handling with no server storage
- **HTTPS Enforcement**: All deployments use HTTPS

### 🔄 Planned
- **Content Security Policy (CSP)**: Enhanced XSS protection
- **Rate Limiting**: API request throttling
- **Image Sanitization**: Additional image processing security

## 📋 Security Checklist for Deployments

Before deploying:

- [ ] All dependencies are up to date (`npm audit`)
- [ ] No secrets in environment variables or code
- [ ] HTTPS is enforced
- [ ] Error messages don't expose sensitive information
- [ ] File upload validation is working
- [ ] API keys are properly secured

## 🔍 Security Monitoring

We monitor for:
- Dependency vulnerabilities (Dependabot)
- Code security issues (CodeQL)
- Exposed secrets (Secret scanning)
- Unusual repository activity

## 📞 Contact

For security-related questions or concerns:
- **Security Issues**: Use GitHub Security Advisories
- **General Security Questions**: Open a [Discussion](../../discussions)
- **Urgent Matters**: Email [your-email@domain.com]

## 🙏 Responsible Disclosure

We appreciate security researchers who:
- Report vulnerabilities privately first
- Allow reasonable time for fixes (typically 90 days)
- Provide clear reproduction steps
- Don't access or modify user data

We commit to:
- Acknowledge reports within 48 hours
- Provide regular updates on fix progress
- Credit researchers (if desired) in security advisories
- Fix critical vulnerabilities as quickly as possible

## 📜 Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.0.1)
- Documented in release notes
- Announced in GitHub Security Advisories
- Communicated via repository notifications

Thank you for helping keep our project secure! 🛡️
