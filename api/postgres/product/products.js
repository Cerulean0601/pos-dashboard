import { sql } from '@vercel/postgres';
import { executeQuery } from '../_utility';

export default async function handler(request, response) {
  
  try{
    const { rows } =
    await sql`SELECT *
                FROM "Product" 
                INNER JOIN "ProductCategory" 
                ON "Product"."CategoryID" = "ProductCategory"."CategoryID";`;

    return response.status(200).json(rows);
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({ message: 'Internal Server Error' });
  };
}