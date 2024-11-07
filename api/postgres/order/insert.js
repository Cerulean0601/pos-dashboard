import { db } from '@vercel/postgres';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { OrderTime, PerformanceID, Notes, OrderProducts } = request.body;
  const client = await db.connect();

  try {

    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO "Order" ("OrderTime", "PerformanceID", "Notes") VALUES ($1, $2, $3) RETURNING "OrderID"',
      [OrderTime, PerformanceID, Notes]
    );
    const OrderID = orderResult.rows[0].OrderID;

    const placeholder = OrderProducts.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ');
    const params = OrderProducts.flatMap(product => [OrderID, product.ProductID, product.Quantity]);

    await client.query(
      `INSERT INTO "OrderProduct" ("OrderID", "ProductID", "Quantity") VALUES ${placeholder}`,
      params
    );

    await client.query('COMMIT');
    return response.status(200).json({ success: true, message: 'Order submitted successfully', OrderID });
  } catch (error) {

    await client.query('ROLLBACK');
    console.error('Database query error:', error);
    return response.status(500).json({ success: false, message: 'Failed to submit order', error: error.message });
  } finally {
    client.release();
  }
}