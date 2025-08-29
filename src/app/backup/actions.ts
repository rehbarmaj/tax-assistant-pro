'use server';

import { promises as fs } from 'fs';
import path from 'path';
import { executeQuery } from '@/lib/db';
import type { RowDataPacket, OkPacket } from 'mysql2';

interface ActionResult {
  success: boolean;
  message: string;
}

export async function initializeDatabase(): Promise<ActionResult> {
  try {
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    
    // Split SQL file into individual statements
    const statements = schemaSql.split(/;\s*$/m).filter(s => s.trim().length > 0);

    for (const statement of statements) {
      await executeQuery(statement);
    }

    return {
      success: true,
      message: 'Database initialized successfully. All tables have been created.',
    };
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return {
      success: false,
      message: error.message || 'An unknown error occurred during database initialization.',
    };
  }
}
