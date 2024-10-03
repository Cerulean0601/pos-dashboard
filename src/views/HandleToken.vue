<script setup>
import { handleDropboxAuth } from '../assets/js/auth.js';

handleDropboxAuth();
window.location.href = "/";
</script>