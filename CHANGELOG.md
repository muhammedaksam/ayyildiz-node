# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2025-07-09

### Added
- Comprehensive test coverage achieving 100% across all metrics (statements, branches, functions, lines)
- Additional test cases for BaseResponse error handling and message fallbacks
- Test coverage for SmsResponse ID parsing from raw response when data.id is not available
- Extensive ReportResponse test cases covering edge cases, field parsing, and numeric fallbacks
- Test cases for unknown error code handling in BaseResponse.getErrorMessage()
- Enhanced test coverage for null/undefined value handling across all response models

### Improved
- Test suite now covers all uncovered branches and lines in core modules
- Enhanced error handling test coverage for AxiosHttpClient
- Complete coverage of all service constructors and integration points
- Improved test data alignment and validation for ReportResponse parsing
- Comprehensive edge case testing for all response models

### Fixed
- Test cases now properly handle all fallback scenarios in response parsing
- Corrected test expectations to match actual implementation behavior
- Fixed test data formatting to ensure proper field alignment in ReportResponse tests

## [0.1.3] - 2025-07-09

### Added
- Codecov coverage badge and integration
- Coverage reporting in CI workflow using Node.js 22.x
- Shields.io badges for better project visibility (npm version, license, TypeScript, CI status, coverage, Node.js version)

### Changed
- Coverage generation now runs on Node.js 22.x instead of 20.x
- Improved README with professional badges and visual indicators

### Fixed
- Fixed coverage file generation and upload to Codecov
- Ensured coverage reports are properly generated before upload

## [0.1.2] - 2025-07-09

### Fixed
- Fixed GitHub Actions permissions for release creation
- Improved release workflow by switching from tag-based to release-based trigger

### Changed
- Release workflow now triggers on GitHub release publication instead of tag creation
- Simplified release process: create GitHub release → automatically publish to NPM
- Updated release workflow job name to accurately reflect its purpose
- Improved release workflow user experience and control

## [0.1.1] - 2025-07-09

### Fixed
- Fixed pnpm version compatibility issues in CI workflows
- Regenerated pnpm-lock.yaml for compatibility with pnpm v10.x
- Fixed codecov action configuration (removed deprecated `file` parameter)
- Ensured pnpm-lock.yaml is tracked in version control for reproducible builds

### Changed
- Removed `packageManager` field from package.json for more flexible pnpm version management
- Updated GitHub Actions workflows to use pnpm version 10 (allows patch updates)

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
