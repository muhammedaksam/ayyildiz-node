# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-09

### Added
- Initial release of Ayyıldız Mobile Node.js SDK
- SMS sending functionality with Turkish character support
- Account operations (credit balance, account info)
- Report operations (SMS reports, summary)
- Sender/Originator operations
- TypeScript support with full type definitions
- Error handling and debug mode
- Support for both XML and HTTP API endpoints
- Batch SMS sending support
- pnpm as preferred package manager

### Features
- **SMS Service**: Send SMS to single or multiple recipients
- **Account Service**: Get account information and credit balance  
- **Report Service**: Retrieve SMS reports and summaries
- **Sender Service**: Manage senders/originators
- **Turkish Character Support**: Automatic handling of Turkish characters
- **Multiple API Support**: Both XML and HTTP API endpoints
- **Debug Mode**: Debug information for requests and responses
- **Error Handling**: Comprehensive error handling
- **TypeScript**: Full TypeScript support with type definitions

### Technical Details
- Built with TypeScript 5.8.3
- Uses Axios for HTTP requests
- Supports Node.js 18+ (tested on 18.x, 20.x, 22.x)
- Comprehensive test coverage with Jest 29.7.0
- ESLint 9.30.1 and Prettier 3.6.2 for code quality
- Full TypeScript support with @types/node 24.0.12

### Dependencies
- axios: ^1.10.0

### Development Dependencies
- TypeScript 5.8.3
- Jest 29.7.0 for testing
- ESLint 9.30.1 for linting
- Prettier 3.6.2 for formatting
- @types/jest 30.0.0
- @types/node 24.0.12
- ts-jest 29.4.0
- @typescript-eslint/eslint-plugin 8.36.0
- @typescript-eslint/parser 8.36.0
