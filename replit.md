# Thoughtful Package Sorting Library

## Overview
This is a TypeScript library for sorting packages based on their physical dimensions and weight. It classifies packages into three categories:
- **STANDARD**: Not bulky and not heavy
- **SPECIAL**: Either bulky or heavy (but not both)
- **REJECTED**: Both bulky and heavy

### Current State
Fully functional TypeScript/Node.js library with comprehensive test coverage. All 32 tests passing.

## Recent Changes
- **2025-11-04**: Initial project import and Replit setup
  - Configured TypeScript with Jest type definitions
  - Added .gitignore for Node.js projects
  - Set up test workflow
  - All tests passing successfully

## Project Architecture

### Structure
```
src/
  ├── index.ts         # Main library code (Package class, sorting logic)
  └── index.test.ts    # Comprehensive test suite (32 tests)
```

### Core Components

#### Package Classification Rules
- **Bulky**: Volume ≥ 1,000,000 cm³ OR any dimension ≥ 150 cm
- **Heavy**: Mass ≥ 20 kg
- **STANDARD**: Neither bulky nor heavy
- **SPECIAL**: Bulky OR heavy (but not both)
- **REJECTED**: Bulky AND heavy

#### Key Exports
- `Package` class: Represents a package with width, height, length, and mass
- `sortPackage()`: Main function to classify packages
- `isBulky()`: Check if a package is bulky
- `isHeavy()`: Check if a package is heavy
- `InvalidPackageError`: Custom error for invalid package data
- `Stack` enum: Classification categories

### Dependencies
- TypeScript 5.9.3
- Jest 30.2.0 (testing framework)
- ts-jest 29.4.5 (TypeScript support for Jest)
- ts-node 10.9.2 (TypeScript execution)

### Available Scripts
- `npm start`: Run the library (ts-node src/index.ts)
- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run build`: Compile TypeScript to JavaScript

## User Preferences
None documented yet.
