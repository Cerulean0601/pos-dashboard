import { insertMultiRows, updateMultiRows, deleteMultiRows } from './_handler.js';
export default async function handler(request, response) {
  // Fetching records for the specific page number returning 10 records per page
  try{
    const {add, update, remove} = request.body;
    await insertMultiRows(add);
    await updateMultiRows(update);
    await deleteMultiRows(remove);
    return response.status(200).json();
  } catch(error) {
    console.error('Database query error:', error);
    // Sending error response
    return response.status(500).json({"error": error});
  };
}