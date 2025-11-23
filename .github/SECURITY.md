# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depend on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **security@firelinksystem.com**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.

## Security Considerations for UK Fire & Security Companies

FireLink System handles sensitive data including:
- Customer contact information and addresses
- Security system specifications and locations
- Engineer schedules and routes
- Financial and payment information
- UK VAT and compliance documentation

### Data Protection
- All data is encrypted at rest and in transit
- Regular security audits and penetration testing
- GDPR compliant for UK/EU customers
- Secure authentication with JWT tokens

### Compliance
- BS5839 certificate generation and storage
- Gas Safety record management (if applicable)
- VAT calculation and reporting for UK businesses
- Secure document storage and transmission

## Security Updates

We regularly update dependencies and conduct security reviews. Subscribe to security announcements by watching this repository.

## Responsible Disclosure

We appreciate responsible disclosure of security vulnerabilities. We will acknowledge your contribution to security if you are the first to report a issue that we eventually fix.
