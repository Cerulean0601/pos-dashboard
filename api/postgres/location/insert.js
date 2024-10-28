import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try{
    const query = `INSERT INTO "Location" ("LocationName") VALUES ($1)`;
    const param = request.body
    await sql.query(query, [param]);

    return response.status(200).json();
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}