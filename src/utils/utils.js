export function performanceName(startTime, LocationName) {
    const date = new Date(startTime);
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
  
    const formattedDate = `${year}/${month}/${day}`;
  
    return `${formattedDate} - ${LocationName}`;
  }
  