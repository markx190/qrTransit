<template>
  <EditStationDialog
    :editStationModal="eSDialog"
    :sData="eStationData"
    :fTitle="formTitle"
    @close="closeEditStationDialog"
    @hide="closeEditStationDialog"
  />
  <q-dialog v-if="sDialog" :model-value="true" persistent>
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
          <q-form @submit="addStation" class="q-gutter-md" ref="form">
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="fTitle !== 'Delete Route'"
            >
              <div class="col-md-3 q-mr-sm">
                <label>NAME</label>
                <q-input
                  outlined
                  v-model="aStations.name"
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
                  v-model="aStations.label"
                  hint="LABEL"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>KILOMETER</label>
                <q-input
                  type="number"
                  outlined
                  v-model="aStations.kilometer"
                  hint="KILOMETER"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
            </div>
            <q-btn
              v-if="fTitle === 'Delete Route'"
              label="Delete"
              type="submit"
              color="red"
            />
            <q-btn v-else label="Add" type="submit" color="primary" />
          </q-form>
        </div>
        <div class="row rounded-borders">
          <div class="col-md-12 q-pa-xs" style="max-width: 1850px">
            <label class="text-uppercase"
              >FARE GUIDE: DIRECTION - ({{ direction }}) - FROM: {{ from }} to
              {{ to }}</label
            >
            <q-table
              :rows="qrStationsByRouteId"
              :columns="colx"
              :filter="filter"
              :loading="loading"
              row-key="name"
            >
              <template v-slot:body-cell-baseFare="props">
                <q-td :props="props">{{ bFare }} </q-td>
              </template>
              <template v-slot:body-cell-perKmFare="props">
                <q-td :props="props">{{ perKmFare }} </q-td>
              </template>
              <template v-slot:body-cell-fare="props">
                <q-td :props="props">PHP: {{ props.row.fare }} </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    round
                    icon="mode_edit"
                    color="primary"
                    @click="openEditStation(props.row)"
                    class="q-mr-sm"
                  />
                  <q-btn
                    round
                    icon="delete"
                    color="red"
                    @click="openDeleteStation(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
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
import EditStationDialog from "components/EditStationDialog.vue";

export default defineComponent({
  name: "ShowStaitonsDialog",
  components: {
    EditStationDialog,
  },
  props: ["stationData", "rxId", "sDialog", "fTitle"],
  setup() {
    const loading = ref(true);
    const filter = ref("");
    return {
      colx,
      // loading,
      filter,
    };
  },
  data() {
    return {
      eStationData: {
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
      eSDialog: false,
      formTitle: "",
      submitAlert: "",
      updateStationMsg: "",
      route_id: "",
      direction: "",
      from: "",
      to: "",
      bFare: "",
      perKmFare: "",
      stationXId: "",
    };
  },

  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      qrStationsByRouteId: "qrTrans/qrStationsByRouteId",
      qrRoutesByRouteId: "qrTrans/qrRoutesByRouteId",
    }),
  },
  watch: {
    rxId: {
      handler(val) {
        if (val) {
          this.getQrRoutesByRouteId();
          this.getQrFareGuideByRouteId();
        } else {
          null;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async getQrFareGuideByRouteId() {
      this.route_id = this.rxId;
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const stationsList = await this.$store.dispatch(
        "qrTrans/getQrFareGuideByRouteId",
        this.rxId,
        auth
      );
    },
    async getQrRoutesByRouteId() {
      this.route_id = this.rxId;
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const routesData = await this.$store.dispatch(
        "qrTrans/getQrRoutesByRouteId",
        this.rxId,
        auth
      );
      this.direction = this.qrRoutesByRouteId.direction;
      this.perKmFare = this.qrRoutesByRouteId.perKmFare;
      this.bFare = this.qrRoutesByRouteId.baseFare;
      this.from = this.qrRoutesByRouteId.from;
      this.to = this.qrRoutesByRouteId.to;
    },
    async addStation() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        routeId: this.rxId,
        name: this.aStations.name,
        label: this.aStations.label,
        kilometer: this.aStations.kilometer,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/createStations",
        data,
        auth
      );
      this.updateStationMsg = "STATION WAS ADDED SUCCESSFULLY";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getRoutes();
        }, 3000);
    },
    openEditStation(st) {
      this.eSDialog = true;
      this.formTitle = "EDIT STATION";
      this.eStationData = {
        id: st.stationId,
        name: st.from,
        label: "STATION",
        kilometer: st.km,
      };
    },
    openDeleteStation(st) {
      this.eSDialog = true;
      this.formTitle = "DELETE STATION";
      this.eStationData = {
        id: st.stationId,
      };
    },
    closeEditStationDialog() {
      this.eSDialog = false;
    },
    close() {
      this.$emit("close");
    },
  },
});

const colx = [
  {
    name: "from",
    align: "left",
    label: "FROM",
    field: "from",
    sortable: true,
  },
  {
    name: "to",
    align: "left",
    label: "TO",
    field: "to",
    sortable: true,
  },
  {
    name: "kilometer",
    align: "left",
    label: "KILOMETER",
    field: "km",
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
