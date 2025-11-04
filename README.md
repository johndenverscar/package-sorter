# Package Sorting System

A TypeScript-based package sorting system that classifies packages into different stacks (STANDARD, SPECIAL, or REJECTED) based on their dimensions and mass.

## Prerequisites

- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js

To verify your installation:
```bash
node --version
npm --version
```

## Installation

1. Install dependencies:
```bash
npm install
```

This will install:
- TypeScript
- Jest (testing framework)
- ts-jest (TypeScript support for Jest)
- ts-node (TypeScript execution)
- Type definitions

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Building the Project

Compile TypeScript to JavaScript:
```bash
npm run build
```

The compiled output will be in the `dist/` directory.

## Usage

```typescript
import { sortPackage, Stack } from './src/index'

// Sort a package
const result = sortPackage(100, 50, 50, 15)
console.log(result) // Output: "SPECIAL" (bulky but not heavy)

// Examples for each classification:
sortPackage(10, 10, 10, 5)    // STANDARD - small and light
sortPackage(150, 10, 10, 5)   // SPECIAL - bulky (dimension >= 150cm)
sortPackage(10, 10, 10, 20)   // SPECIAL - heavy (mass >= 20kg)
sortPackage(150, 10, 10, 20)  // REJECTED - bulky AND heavy
```

## Classification Rules

### STANDARD
- Not bulky AND not heavy
- Regular processing

### SPECIAL
- Bulky OR heavy (but not both)
- Requires special handling

### REJECTED
- Both bulky AND heavy
- Cannot be processed

### Thresholds

A package is considered **bulky** if:
- Volume >= 1,000,000 cm^3, OR
- Any dimension (width, height, or length) >= 150 cm

A package is considered **heavy** if:
- Mass >= 20 kg