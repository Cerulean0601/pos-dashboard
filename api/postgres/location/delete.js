// delete.js
import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {
    // 確認請求方法是 DELETE
    if (request.method !== 'DELETE') {
      return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { LocationID } = request.body;

    // 確認 LocationID 是否提供
    if (!LocationID) {
      return response.status(400).json({ error: 'LocationID is required' });
    }

    // 刪除指定 LocationID 的場地
    const query = `DELETE FROM "Location" WHERE "LocationID" = $1`;

    const result = await sql.query(query, [LocationID]);

    if (result.rowCount === 0) {
      return response.status(404).json({ error: 'Location not found' });
    }

    return response.status(200).json({ message: 'Location deleted successfully' });

  } catch (error) {
    console.error('Database query error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
