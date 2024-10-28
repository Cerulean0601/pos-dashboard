import { sql } from '@vercel/postgres';
export default async function handler(request, response) {
  // Fetching records for the specific page number returning 10 records per page
  try{
    const { rows } = await sql`SELECT "LocationID","LocationName" FROM "Location" `;

    return response.status(200).json(rows);
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({ message: 'Internal Server Error' });
  };
}