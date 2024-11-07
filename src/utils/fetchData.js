export async function fetchAndCache(fetchFunction, storageKey="") {
  let data = null;
  if (!storageKey) {
    storageKey = fetchFunction.name.replace(/^fetch/, "");
  }
  if (localStorage.getItem(storageKey) === null) {
		try {
			const response = await fetchFunction();
			data = await response.json();
			if(!response.ok) throw new Error(`Request failed with status ${data}`)
				
			localStorage.setItem(storageKey, JSON.stringify(data));
			return data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
  } else {
    data = JSON.parse(localStorage.getItem(storageKey));
  }
  return data;
}
export async function fetchCategories() {
	return await fetch('/api/postgres/category/categories');
}

export async function fetchProducts() {
	return await fetch('/api/postgres/product/products');
}

export async function fetchLoactions() {
	return await fetch('/api/postgres/location/locations');
}