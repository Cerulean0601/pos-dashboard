<script setup>
import { useRoute } from "vue-router";
// import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";

// const store = useStore();

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/dashboard-default"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/products"
          :class="getRoute() === 'products' ? 'active' : ''"
          :navText="'Products'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-bullet-list-67 text-primary text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/performance"
          :class="getRoute() === 'performance' ? 'active' : ''"
          :navText="'Performance'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-box-2 text-primary text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
