<script setup>
// import AuthorsTable from "./components/AuthorsTable.vue";
import ProdcutManager from "./components/ProductManager.vue";
// import ProjectsTable from "./components/ProjectsTable.vue";
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <prodcut-manager />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-12">
        <projects-table />
      </div>
    </div>
  </div>
</template>
