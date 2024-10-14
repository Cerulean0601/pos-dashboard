import { sql } from '@/db';
 
export const dynamic = 'force-dynamic';
 
export async function GET() {
  await sql.query(`INSERT INTO ProductCategory (CategoryName) VALUES ('客製品');`);
  return Response.json({ success: true });
}