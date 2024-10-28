import { sql } from '@vercel/postgres';

/**
 * 表格結構：
 * - Category:
 *   - CategoryID (number): primary key、serial
 *   - CategoryName (string):
 *
 */
export async function insertMultiRows(categories) {
  if (!categories || !categories.length) return;

  const placeholder = categories.map((category, index) => {
    return `$${index+1}`;
  });

  const insertQuery = `
    INSERT INTO "Category" ("CategoryName") VALUES (${placeholder.join(', ')})`;

    return await sql`${insertQuery}`;
}

export async function updateMultiRows(categories) {
  if(!categories || categories.length === 0) return;
  
  const params = categories.map(category => {
    return [category.CategoryID, category.CategoryName]
  });

  const query = `
      UPDATE "Category"
      SET "CategoryName" = $2
      WHERE "CategoryID" = $1`;
      
  // 執行所有更新
  await Promise.all(params.map(param => {
    return sql.query(query, param); // Execute the query
  }));
}

export async function deleteMultiRows(categoryIDs) {
  if(!categoryIDs || !categoryIDs.length) return;

  if(categoryIDs.some(id => id === undefined || id === null || id === '')) {
    throw new Error("ProductID cannot be empty or undefined");
  }

  // const query = `DELETE FROM "Product" WHERE "ProductID" IN (` + productIDs.join(",") +`)`;
  const placeholder = categoryIDs.map((id, index) => {
    return `$${index + 1}`;
  })
  .join(",");
  const query = `DELETE FROM "Category" WHERE "CategoryID" IN (${placeholder})`;

  return await sql.query(query, categoryIDs);

}