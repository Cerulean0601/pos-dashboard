export async function fetchAndCache(fetchFunction, storageKey="", ...args) {
  let data = null;
  if (!storageKey) {
    storageKey = fetchFunction.name.replace(/^fetch/, "");
  }

	// 確認資料的快取是否過期
	const cacheExpiryDuration  = 8 * 60 * 60 * 1000;
  const currentTime = new Date();
  const cachedTimestamp = localStorage.getItem(`${storageKey}_timestamp`);
  const cachedDate = cachedTimestamp ? new Date(cachedTimestamp) : null;
	const isCacheExpired = !cachedDate || (currentTime - cachedDate > cacheExpiryDuration);

  
  if (isCacheExpired || localStorage.getItem(storageKey) === null) {
		try {
			const response = await fetchFunction(...args);
			data = await response.json();
			if(!response.ok) throw new Error(`Request failed with status ${data}`)
				
			localStorage.setItem(storageKey, JSON.stringify(data));
			localStorage.setItem(`${storageKey}_timestamp`, currentTime.toISOString());
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

export async function fetchPerformances({ offset = 1, limit = 10 } = {}) {
	const queryParams = new URLSearchParams({ offset, limit }).toString();
	return await fetch(`/api/postgres/performance/performances?${queryParams}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
};