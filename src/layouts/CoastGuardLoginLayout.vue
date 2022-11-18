<template>
  <q-layout view="hHh lpR fFf">
    <!-- <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <img
            src="http://159.138.135.212/qrImages/qrl_small.png"
            style="width: 120px; height: 43px; margin-top: 12px"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-caption" style="text-align: center">
            2020 QRTransit AFCS Application
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginLayout",
});
</script>
