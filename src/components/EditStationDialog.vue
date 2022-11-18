<template>
  <q-dialog v-if="editStationModal" :model-value="true">
    <q-card style="width: 1350px; max-width: 80vw">
      <q-card-section>
        <q-banner inline-actions class="bg-grey-2 text-black text-weight-bold">
          <q-icon size="md" name="location_city" />
          {{ fTitle }}
        </q-banner>
        <q-banner
          v-if="submitAlert"
          inline-actions
          rounded
          class="bg-green-3 text-white q-mt-sm"
        >
          <q-spinner-hourglass color="primary" size="2em" />
          {{ updateStationMsg }}
        </q-banner>
        <div class="q-mt-lg q-mb-md" style="max-width: 1350px">
          <q-form
            @submit="submitEditStationForm()"
            class="q-gutter-md"
            ref="form"
          >
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="fTitle !== 'DELETE STATION'"
            >
              <div class="col-md-3 q-mr-sm">
                <label>NAME</label>
                <q-input
                  outlined
                  v-model="stationData.name"
                  hint="NAME"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>LABEL</label>
                <q-input
                  outlined
                  v-model="stationData.label"
                  hint="LABEL"
                  disable
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>KILOMETER</label>
                <q-input
                  type="number"
                  outlined
                  v-model="stationData.kilometer"
                  hint="KILOMETER"
                />
              </div>
            </div>
            <q-card-section v-else class="q-pt-none text-weight-bold">
              Are you sure you want to delete this Station?
            </q-card-section>
            <q-btn
              v-if="fTitle === 'DELETE STATION'"
              label="DELETE"
              type="submit"
              color="red"
            />
            <q-btn v-else label="UPDATE" type="submit" color="primary" />
          </q-form>
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
  name: "EditStationDialog",
  props: ["sData", "editStationModal", "fTitle"],
  setup() {
    const loading = ref(true);
    const filter = ref("");
    return {
      colx,
      filter,
    };
  },
  data() {
    return {
      stationData: {
        id: "",
        name: "",
        label: "",
        kilometer: "",
      },
      aStations: {
        routeId: "",
        name: "",
        label: "",
        kilometer: "",
      },
      formTitle: "",
      submitAlert: "",
      updateStationMsg: "",
      route_id: "",
      direction: "",
      from: "",
      to: "",
      bFare: "",
      perKmFare: "",
    };
  },
  watch: {
    sData: {
      handler(val) {
        if (val) {
          this.stationData.id = val.id;
          this.stationData.name = val.name;
          this.stationData.label = val.label;
          this.stationData.kilometer = val.kilometer;
        } else {
          this.stationData._id = "";
          this.stationData.name = "";
          this.stationData.label = "";
          this.stationData.kilometer = "";
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      qrStationsByRouteId: "qrTrans/qrStationsByRouteId",
      qrRoutesByRouteId: "qrTrans/qrRoutesByRouteId",
    }),
  },
  methods: {
    async getAppRoutes() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routeList = await this.$store.dispatch("qrTrans/getQrRoutes", data);
    },
    async saveUpdatedStations() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        id: this.stationData.id,
        name: this.stationData.name,
        label: this.stationData.label,
        kilometer: this.stationData.kilometer,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/updateStations",
        data,
        auth
      );
      this.updateStationMsg = "STATION WAS SUCCESSFULLY UPDATED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppRoutes();
        }, 3000);
    },
    async deleteStations() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;

      let data = {
        id: this.stationData.id,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/deleteStations",
        data,
        auth
      );
      this.updateStationMsg = "STATION WAS DELETED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppRoutes();
        }, 3000);
    },
    submitEditStationForm() {
      this.fTitle === "EDIT STATION"
        ? this.saveUpdatedStations()
        : this.fTitle === "DELETE STATION"
        ? this.deleteStations()
        : null;
    },
    close() {
      this.$emit("close");
    },
  },
});

const colx = [
  {
    name: "name",
    align: "left",
    label: "STATION",
    field: "name",
    sortable: true,
  },
  {
    name: "kilometer",
    align: "left",
    label: "KILOMETER",
    field: "kilometer",
    sortable: true,
  },
  {
    name: "baseFare",
    align: "left",
    label: "BASEFARE",
    field: "baseFare",
    sortable: true,
  },
  {
    name: "perKmFare",
    align: "left",
    label: "PER KM FARE",
    field: "perKmFare",
    sortable: true,
  },
  {
    name: "fare",
    align: "center",
    label: "FARE",
    field: "fare",
    sortable: false,
  },
  {
    name: "actions",
    align: "center",
    label: "ACTION",
    field: "actions",
    sortable: false,
  },
];
</script>
