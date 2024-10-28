export async function fetchAndCache(fetchFunction, storageKey) {
  let data;
  if (localStorage.getItem(storageKey) === null) {
    data = await fetchFunction();
    
    localStorage.setItem(storageKey, JSON.stringify(data));
  } else {
    data = JSON.parse(localStorage.getItem(storageKey));
  }
  return data;
}
export async function fetchCategories() {
	try {
		const response = await fetch('/api/postgres/category/categories');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching categories:', error);
	}
}

export async function fetchProducts() {
	try {
		const response = await fetch('/api/postgres/product/products');
		const data = await response.json()
		return data;
	} catch (error) {
		console.error('Error fetching products:', error);
	}
}

export async function fetchLoactions() {
	try {
		const response = await fetch('/api/postgres/location/locations');
		const data = await response.json()
		return data;
	} catch (error) {
		console.error('Error fetching locations:', error);
	}
}