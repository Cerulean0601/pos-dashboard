import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  try {

    const { startTime, locationName } = request.query;
    const limitString = request.query.limit;
    const offsetString = request.query.offset;

    const limit = parseInt(limitString, 10) || 10; // 預設每頁顯示 10 筆資料
    const offset = ((parseInt(offsetString, 10) || 1) - 1) * limit;

    // 執行 SQL 查詢
    const { rows } = await sql`
      SELECT 
        p."PerformanceID",
        p."EndTime",
        p."StartTime",
        l."LocationName",
        l."LocationID"
      FROM 
        "Performance" AS p
      LEFT JOIN 
        "Location" AS l ON p."LocationID" = l."LocationID"
      WHERE 
        (${startTime}::TIMESTAMP IS NULL OR p."StartTime" >= ${startTime}) AND
        (${locationName}::VARCHAR IS NULL OR l."LocationName" = ${locationName})
      ORDER BY 
        p."StartTime" DESC
      LIMIT 
        ${limit}
      OFFSET 
        ${offset};
    `;

    // 成功取得資料後回傳 JSON 格式的資料
    return response.status(200).json(rows);

  } catch (error) {
    console.error('Database query error:', error);
    // 若發生錯誤，回傳 500 狀態碼和錯誤訊息
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}
