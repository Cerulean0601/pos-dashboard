import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try{
    const query = `INSERT INTO "Location" ("LocationName") VALUES ($1) RETURNING "LocationID"`;
    const { LocationName } = request.body;
    const result = await sql.query(query, [LocationName]);

    return response.status(200).json({"LocationID": result.rows[0].LocationID});
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}