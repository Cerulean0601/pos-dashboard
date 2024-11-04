import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { OrderTime, PerformanceID, Notes, OrderProducts } = request.body;

  try {
    // 開啟交易
    await sql`BEGIN`;

    // 插入訂單資料
    const orderResult = await sql`
      INSERT INTO "Order" ("OrderTime", "PerformanceID", "Notes")
      VALUES (${OrderTime}, ${PerformanceID}, ${Notes})
      RETURNING "OrderID"
    `;
    const OrderID = orderResult.rows[0].OrderID;

    // 插入訂單品項資料
    const placeholder = OrderProducts.map((item, index) => {
        return `($${index+1}, $${index+2}, $${index+3})`;
    });
    const params = OrderProducts.map()
    await sql`INSERT INTO "OrderItem" ("OrderID", "ProductID", "Quantity")
                VALUES (${placeholder.join(', ')})`

    // 提交交易
    await sql`COMMIT`;
    return response.status(200).json({ success: true, message: 'Order submitted successfully', orderID });
  } catch (error) {
    // 回滾交易
    await sql`ROLLBACK`;
    console.error('Database query error:', error);
    return response.status(500).json({ success: false, message: 'Failed to submit order', error });
  }
}
