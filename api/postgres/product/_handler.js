import { sql } from '@vercel/postgres';

/**
 * 表格結構：
 * - Product:
 *   - ProductID (number): primary key、serial
 *   - ProductName (string):
 *   - Price (number):
 *   - CategoryID (number): forigen key references "ProductCategory"
 *
 */
export async function insertMultiRows(products) {
  if (!products || !products.length) return;

  // 構建 VALUES 部分
  const valueExpressions = products.map((product, index) => {
    const ProductName = `$${index * 3 + 1}`;
    const Price = `$${index * 3 + 2}`;
    const CategoryName = `$${index * 3 + 3}`;
    return `(
      ${ProductName}, 
      ${Price}, 
      (SELECT "CategoryID" FROM "ProductCategory" WHERE "CategoryName" = ${CategoryName})
    )`;
  });

  const insertQuery = `
    INSERT INTO "Product" ("ProductName", "Price", "CategoryID")
    VALUES ${valueExpressions.join(', ')}`;

  const queryParams = products.flatMap(product => [
    product.ProductName,
    product.Price === "" ? null : product.Price,
    product.CategoryName,
  ]);
  return await sql.query(insertQuery, queryParams);
}

/**
 * 更新多個產品資料。
 *
 * @param {Array<Object>} products - 包含要更新的產品資料的數組，每個物件必須包含 ProductID 和可選的其他屬性。
 * @returns {Promise<void>}
 */
export async function updateMultiRows(products) {
  if(!products || products.length === 0) return;
  
  const params = products.map(product => {
    const price = product.Price === "" ? null : product.Price
    return [product.ProductName, price, product.CategoryID, product.ProductID]
  });

  const query = `
      UPDATE "Product"
      SET "ProductName" = $1, 
          "Price" = $2, 
          "CategoryID" = $3
      WHERE "ProductID" = $4`;
      
  // 執行所有更新
  await Promise.all(params.map(param => {
    return sql.query(query, param); // Execute the query
  }));
}

export async function deleteMultiRows(productIDs) {
  if(!productIDs || !productIDs.length) return;

  if(productIDs.some(id => id === undefined || id === null || id === '')) {
    throw new Error("ProductID cannot be empty or undefined");
  }

  // const query = `DELETE FROM "Product" WHERE "ProductID" IN (` + productIDs.join(",") +`)`;
  const placeholder = productIDs.map((id, index) => {
    return `$${index + 1}`;
  })
  .join(",")
  const query = `DELETE FROM "Product" WHERE "ProductID" IN (${placeholder})`;
  
  return await sql.query(query, productIDs);

}