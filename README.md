# Ayyıldız Mobile Node.js SDK

[![npm version](https://img.shields.io/npm/v/@muhammedaksam/ayyildiz-node.svg)](https://www.npmjs.com/package/@muhammedaksam/ayyildiz-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/muhammedaksam/ayyildiz-node/workflows/CI/badge.svg)](https://github.com/muhammedaksam/ayyildiz-node/actions)
[![codecov](https://codecov.io/gh/muhammedaksam/ayyildiz-node/branch/main/graph/badge.svg)](https://codecov.io/gh/muhammedaksam/ayyildiz-node)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Unofficial Node.js SDK for Ayyıldız Mobile SMS API.

## Installation

### Using pnpm (recommended)

```bash
pnpm add @muhammedaksam/ayyildiz-node
```

### Using npm

```bash
npm install @muhammedaksam/ayyildiz-node
```

### Using yarn

```bash
yarn add @muhammedaksam/ayyildiz-node
```

## Quick Start

```typescript
import { AyyildizClient } from '@muhammedaksam/ayyildiz-node';

const client = new AyyildizClient({
  username: 'your-username',
  password: 'your-password',
  companyCode: 'your-company-code',
  defaultOriginator: 'SENDER' // optional
});

// Send SMS
const response = await client.sms().send({
  to: '+905551234567',
  message: 'Hello from Ayyıldız Mobile!'
});

console.log(response.success);
```

## Configuration

### Constructor Options

```typescript
// Option 1: Using config object
const client = new AyyildizClient({
  username: 'your-username',
  password: 'your-password',
  companyCode: 'your-company-code',
  defaultOriginator: 'SENDER' // optional
});

// Option 2: Using parameters
const client = new AyyildizClient(
  'your-username',
  'your-password',
  'your-company-code',
  'SENDER' // optional
);
```

## API Reference

### SMS Operations

#### Send SMS

```typescript
// Send single SMS
await client.sms().send('+905551234567', 'Your message');

// Send SMS with custom originator
await client.sms().send('+905551234567', 'Your message', 'CUSTOM');

// Send SMS to multiple recipients
await client.sms().send(['+905551234567', '+905557654321'], 'Your message');

// Send different messages to different recipients
await client.sms().send({
  '+905551234567': 'Message for first recipient',
  '+905557654321': 'Message for second recipient'
});
```

#### Send SMS via HTTP GET

```typescript
// Send SMS using HTTP GET method
await client.sms().sendViaHttp('+905551234567', 'Your message', 'SENDER');
```

#### Schedule SMS

```typescript
// Schedule SMS for later delivery
await client
  .sms()
  .schedule('311220241430') // ddmmyyyyhhmm format
  .send('+905551234567', 'Scheduled message');
```

#### Set SMS Type

```typescript
import { SmsType } from '@muhammedaksam/ayyildiz-node';

// Set SMS type before sending
await client
  .sms()
  .setType(SmsType.LONG) // 918 character SMS
  .send('+905551234567', 'Long message');

// Available SMS types:
// SmsType.STANDARD = 160 character SMS
// SmsType.LONG = 918 character SMS
// SmsType.TURKISH_SHORT = 70 character Turkish SMS
// SmsType.TURKISH_LONG = 402 character Turkish SMS
// SmsType.TURKISH_STANDARD = 155/894 character Turkish SMS (default)
// SmsType.INTERNATIONAL = 402 character International SMS
```

### Account Operations

#### Get Credit Balance

```typescript
const balance = await client.account().getCredit();
console.log(balance.data);
```

### Report Operations

#### Get SMS Reports

```typescript
// Get reports by date range
const reports = await client.reports().getByDateRange('20240101', '20240131');

// Get detailed report by message GUID
const detailedReport = await client.reports().getDetailedReport('message-guid');

// Get report by message ID
const report = await client.reports().getByMessageId('message-id');

// Get report in XML format
const xmlReport = await client.reports().getXmlReport('message-id');
```

### Sender Operations

#### Get Available Originators

```typescript
const originators = await client.senders().getOriginators();
console.log(originators.data);
```

## Error Handling

```typescript
try {
  const response = await client.sms().send('+905551234567', 'Hello!');

  if (response.success) {
    console.log('SMS sent successfully');
  } else {
    console.error('SMS failed:', response.error);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

## Debug Mode

```typescript
const client = new AyyildizClient(config);

// Send SMS
await client.sms().send({
  to: '+905551234567',
  message: 'Hello!'
});

// Get debug information
console.log(client.debug());
```

## Turkish Character Support

The SDK automatically handles Turkish characters in SMS messages. You can send
messages with Turkish characters like ğ, ü, ş, ı, ö, ç without any special
configuration.

## Development

### Prerequisites

- Node.js (latest LTS version recommended)
- pnpm (latest version recommended as package manager)

### Setup

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies (uses pnpm-lock.yaml)
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test

# Lint code
pnpm run lint

# Format code
pnpm run format
```

### Package Manager Benefits

This project uses **pnpm** as the preferred package manager for several
advantages:

- **Faster installations**: pnpm reuses packages from a global store
- **Disk space efficiency**: No duplicate packages across projects
- **Stricter dependency resolution**: Better compatibility and security
- **Monorepo support**: Excellent for complex project structures
- **Lockfile optimization**: More reliable dependency resolution

### pnpm Commands

```bash
# Install dependencies
pnpm install

# Add a dependency
pnpm add package-name

# Add a dev dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

### Building

```bash
pnpm run build
```

This will compile TypeScript to JavaScript in the `dist` directory.

## Package Manager

This project uses pnpm as the preferred package manager. While you can use npm
or yarn, pnpm is recommended for:

- Faster installation
- Better disk space efficiency
- Stricter dependency resolution
- Better monorepo support

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions. No
additional `@types` packages are needed.

## API Documentation

For detailed API documentation, please visit
[Ayyıldız Mobile API Documentation](https://api.ayyildizmobile.com/docs).

## Support

For support and questions:

- GitHub Issues:
  [https://github.com/muhammedaksam/ayyildiz-node/issues](https://github.com/muhammedaksam/ayyildiz-node/issues)

## License

This project is licensed under the MIT License - see the
[LICENSE.md](LICENSE.md) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about changes in each version.
