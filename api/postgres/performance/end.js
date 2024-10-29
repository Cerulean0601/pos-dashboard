import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try{
    const query = `UPDATE "Performance" SET "EndTime" = $1 WHERE "PerformanceID" = $2`;
    const {EndTime, PerformanceID} = request.body
    await sql.query(query, [EndTime, PerformanceID]);

    return response.status(200).json();
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}