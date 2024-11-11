import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    const { rows } = await sql`
      SELECT 
        COUNT(p."PerformanceID") AS count
      FROM 
        "Performance" AS p
      LEFT JOIN 
        "Location" AS l ON p."LocationID" = l."LocationID"
    `;

    return response.status(200).json(rows);

  } catch (error) {
    console.error('Database query error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}
