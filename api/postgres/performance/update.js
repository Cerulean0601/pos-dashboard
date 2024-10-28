import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try{
    const {set, where} = request.body;
    // update query
    return response.status(200).json();
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}