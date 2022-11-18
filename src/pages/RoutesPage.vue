<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn
        class="glossy"
        unelevated
        rounded
        label="Add Route"
        color="green"
        icon="camera_enhance"
        @click="openAddRoutes()"
      />
      <q-input
        class="q-pb-sm q-pt-sm"
        outlined
        dense
        debounce="300"
        color="primary"
        placeholder="Search"
        v-model="filter"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <AddNewRoutesDialog
        :rModal="routeDialog"
        :routeData="aRoutes"
        :fTitle="formTitle"
        @close="closeRouteDialog"
        @hide="closeRouteDialog"
      />
      <ShowStationsDialog
        :sDialog="stationDialog"
        :stationData="rStations"
        :rxId="routeById"
        :fTitle="formTitle"
        @close="closeStationsDialog"
        @hide="closeStationsDialog"
        persistent
      />
      <q-table
        title="ROUTES"
        :rows="qrRoutes"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        row-key="title"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              outline
              icon="pageview"
              color="accent"
              label="Stations"
              @click="showStationDialog(props.row)"
              class="q-mr-sm"
            />
            <q-btn
              round
              icon="mode_edit"
              color="primary"
              @click="openEditRoutes(props.row)"
              class="q-mr-sm"
            />
            <q-btn
              round
              icon="delete"
              color="red"
              @click="openDeleteRoutes(props.row)"
            />
          </q-td>
        </template>
        <template #loading>
          <q-inner-loading showing color="primary" size="90px" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import AddNewRoutesDialog from "components/AddNewRoutesDialog.vue";
import ShowStationsDialog from "components/ShowStationsDialog.vue";

export default defineComponent({
  name: "RoutesPage",
  components: {
    AddNewRoutesDialog,
    ShowStationsDialog,
  },
  setup() {
    const loading = ref(true);
    const filter = ref("");
    return {
      columns,
      loading,
      filter,
    };
  },
  data() {
    return {
      formTitle: "",
      routeById: "",
      routeDialog: false,
      deviceDialog: false,
      stationDialog: false,
      rStations: [],
      aRoutes: {
        _id: "",
        from: "",
        to: "",
        direction: "",
        baseFare: "",
        perKmFare: "",
      },
    };
  },
  created() {
    this.getRoutes();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      searchedUsers: "qrTrans/searchedUsers",
      qrRoutes: "qrTrans/qrRoutes",
    }),
  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/routes")
        : this.$router.push("/");
    },
    async getRoutes() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routesList = await this.$store.dispatch(
        "qrTrans/getQrRoutes",
        data
      );
      this.loading = false;
      console.log("app routes: ", routesList);
    },
    openAddRoutes() {
      this.routeDialog = true;
      this.formTitle = "Add Route";
      this.aRoutes = {
        _id: "",
        direction: "",
        from: "",
        to: "",
        baseFare: "",
        perKmFare: "",
      };
    },
    openEditRoutes(appRoute) {
      this.routeDialog = true;
      this.formTitle = "Edit Route";
      this.aRoutes = {
        _id: appRoute._id,
        direction: appRoute.direction,
        from: appRoute.from,
        to: appRoute.to,
      };
    },
    openDeleteRoutes(appRoute) {
      this.routeDialog = true;
      this.formTitle = "Delete Route";
      this.aRoutes = {
        _id: appRoute._id,
      };
    },
    async showStationDialog(route) {
      console.log("r: ", route._id);
      this.stationDialog = true;
      this.formTitle = "STATIONS";
      this.routeById = route._id;
    },
    closeRouteDialog() {
      this.routeDialog = false;
    },
    closeStationsDialog() {
      this.stationDialog = false;
    },
  },
});

const columns = [
  {
    name: "direction",
    align: "left",
    label: "DIRECTION",
    field: "direction",
    sortable: true,
  },
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
    name: "baseFare",
    align: "left",
    label: "BASEFARE",
    field: "baseFare",
    sortable: true,
  },
  {
    name: "baseFare",
    align: "left",
    label: "PER KM FARE",
    field: "perKmFare",
    sortable: true,
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
