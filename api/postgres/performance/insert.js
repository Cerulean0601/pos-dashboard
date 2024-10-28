import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try{
    const query = `INSERT INTO "Performance" ("LocationID", "StartTime") VALUES ($1, $2)`;
    const {LocationID, StartTime} = request.body
    await sql.query(query, [LocationID, StartTime]);

    return response.status(200).json();
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}