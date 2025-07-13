#!/usr/bin/env node

/**
 * Test Runner for Aspire Banking App
 * 
 * This script runs all vitest tests for the application components
 * and provides a summary of test results.
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

console.log('🧪 Running Aspire Banking App Tests...\n')

try {
  // Run vitest with coverage
  const command = 'npm run test:unit'
  console.log(`Executing: ${command}`)
  
  execSync(command, { 
    stdio: 'inherit',
    cwd: resolve(__dirname, '../../')
  })
  
  console.log('\n✅ All tests completed successfully!')
} catch (error) {
  console.error('\n❌ Tests failed:', error)
  process.exit(1)
} 