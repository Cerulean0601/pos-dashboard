<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="p-3 pb-0 card-header">
            <h6 class="mb-0">Icon Fonts</h6>
          </div>
          <div class="p-3 card-body">
            <ul class="icon-grid">
              <li v-for="(iconClass, index) in iconClasses"
              :key="index"
              class="icon-item">
                <i class="ni"
                :class="iconClass"></i>
                <p>{{ iconClass }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>

export default {
  name: "IconList",
  data() {
    return {
      iconClasses: [
        "ni-active-40",
        "ni-air-baloon",
        "ni-album-2",
        "ni-align-center",
        "ni-align-left-2",
        "ni-ambulance",
        "ni-app",
        "ni-archive-2",
        "ni-atom",
        "ni-badge",
        "ni-bag-17",
        "ni-basket",
        "ni-bell-55",
        "ni-bold-down",
        "ni-bold-left",
        "ni-bold-right",
        "ni-bold-up",
        "ni-bold",
        "ni-book-bookmark",
        "ni-books",
        "ni-box-2",
        "ni-briefcase-24",
        "ni-building",
        "ni-bulb-61",
        "ni-bullet-list-67",
        "ni-bus-front-12",
        "ni-button-pause",
        "ni-button-play",
        "ni-button-power",
        "ni-calendar-grid-58",
        "ni-camera-compact",
        "ni-caps-small",
        "ni-cart",
        "ni-chart-bar-32",
        "ni-chart-pie-35",
        "ni-chat-round",
        "ni-check-bold",
        "ni-circle-08",
        "ni-cloud-download-95",
        "ni-cloud-upload-96",
        "ni-compass-04",
        "ni-controller",
        "ni-credit-card",
        "ni-curved-next",
        "ni-delivery-fast",
        "ni-diamond",
        "ni-email-83",
        "ni-fat-add",
        "ni-fat-delete",
        "ni-fat-remove",
        "ni-favourite-28",
        "ni-folder-17",
        "ni-glasses-2",
        "ni-hat-3",
        "ni-headphones",
        "ni-html5",
        "ni-istanbul",
        "ni-key-25",
        "ni-laptop",
        "ni-like-2",
        "ni-lock-circle-open",
        "ni-map-big",
        "ni-mobile-button",
        "ni-money-coins",
        "ni-note-03",
        "ni-notification-70",
        "ni-palette",
        "ni-paper-diploma",
        "ni-pin-3",
        "ni-planet",
        "ni-ruler-pencil",
        "ni-satisfied",
        "ni-scissors",
        "ni-send",
        "ni-settings-gear-65",
        "ni-settings",
        "ni-single-02",
        "ni-single-copy-04",
        "ni-sound-wave",
        "ni-spaceship",
        "ni-square-pin",
        "ni-support-16",
        "ni-tablet-button",
        "ni-tag",
        "ni-tie-bow",
        "ni-time-alarm",
        "ni-trophy",
        "ni-tv-2",
        "ni-umbrella-13",
        "ni-user-run",
        "ni-vector",
        "ni-watch-time",
        "ni-world",
        "ni-zoom-split-in",
        "ni-collection",
        "ni-image",
        "ni-shop",
        "ni-ungroup",
        "ni-world-2",
        "ni-ui-04",
        "ni-dropbox"
      ],
    };
  },
};

</script>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

/* Remove list markers */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.icon-item i {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
