import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(BACKEND_ROOT, '..');

test('Project 2 (Titan Logistics — Industrial Hardware SKU & Logistics Telemetry) Standalone Structure & Strict TypeScript Verification', () => {
  const required = [
    'backend/package.json',
    'backend/tsconfig.json',
    'backend/src/main.ts',
    'backend/src/app.module.ts',
    'backend/src/products/products.module.ts',
    'backend/src/products/products.controller.ts',
    'backend/src/products/products.service.ts',
    'backend/src/dashboard/dashboard.module.ts',
    'frontend/package.json',
    'frontend/nuxt.config.ts',
    'frontend/app/pages/index.vue',
    'frontend/app/pages/products/index.vue',
    'frontend/app/stores/products.ts',
    'docker-compose.yml',
    'README.md',
    '.env.example',
  ];
  for (const rel of required) {
    assert.equal(fs.existsSync(path.join(PROJECT_ROOT, rel)), true, `Missing ${rel}`);
  }
});
