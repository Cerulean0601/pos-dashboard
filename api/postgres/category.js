import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    // Fetching records for the specific page number returning 10 records per page
    const rows =
        await sql`SELECT "CategoryName" FROM "ProductCategory"`;

    return response.status(200).json({ rows });
  }