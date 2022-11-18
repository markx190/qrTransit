<template>
  <q-dialog v-if="oDialog" :model-value="true">
    <q-card style="width: 1350px; max-width: 80vw">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold text-uppercase">
          {{ fTitle }}
        </div>
        <div class="row bg-grey-2 rounded-borders">
          <div class="col-md-8 q-pa-md" style="max-width: 1350px">
            <div v-for="org in originsData" :key="org">
              {{ org }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "ShowOriginsDialog",
  props: ["originsData", "oDialog", "fTitle"],
  data() {
    return {
      salesOrigins: [],
    };
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getAppRoutes() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routeList = await this.$store.dispatch("qrTrans/getQrSales", data);
    },
  },
});
</script>
