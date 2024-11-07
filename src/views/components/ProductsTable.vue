<script setup>
import { ref, computed, onMounted } from 'vue';
import { fetchAndCache, fetchCategories, fetchProducts } from '../../utils/fetchData';

const emit = defineEmits(["selectProduct"]);
const products = ref([]);
const categories = ref([]);

// 計算分組的產品列表
const groupedProducts = computed(() => {
  const groups = {};
  const categoryMap = categories.value.reduce((map, category) => {
    map[category.CategoryID] = category.CategoryName;
    return map;
  }, {});

  products.value.forEach(product => {
    const categoryName = categoryMap[product.CategoryID];
    if (!groups[categoryName]) {
      groups[categoryName] = {
        categoryName,
        products: [],
      };
    }
    groups[categoryName].products.push(product);
  });

  return Object.values(groups);
});

// 獲取產品與分類資料
onMounted(async () => {
  products.value = await fetchAndCache(fetchProducts);
  categories.value = await fetchAndCache(fetchCategories);
});

// 定義選擇產品的方法
const handleSelectProduct = (product) => {
  emit("selectProduct", product);
};
</script>

<template>
  <div class="container mt-4">
    <div v-for="category in groupedProducts" :key="category.categoryName" class="category mb-4">
      <div class="text-primary"> {{ category.categoryName }} </div>
      <div class="product-list">
        <div v-for="product in category.products" :key="product.ProductID" class="product-item">
          <span @click="handleSelectProduct(product)"> {{ product.ProductName }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category {
  margin-bottom: 20px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.product-item {
  background-color: #f8f9fa;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  white-space: nowrap;
}
</style>
