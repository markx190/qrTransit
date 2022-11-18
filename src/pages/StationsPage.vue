<template>
  <q-page>
    <div class="q-pa-md">
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
      <AddNewDeviceDialog
        :dModal="deviceDialog"
        :stationId="sId"
        :routeId="rId"
        :fTitle="formTitle"
        @close="closeAddNewDeviceDialog"
        @hide="closeAddNewDeviceDialog"
      />
      <q-table
        title="STATIONS"
        :rows="qrStations"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        row-key="title"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              outline
              icon="camera_enhance"
              color="accent"
              label="Add Device"
              @click="addDevice(props.row)"
              class="q-mr-sm"
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
import AddNewDeviceDialog from "components/AddNewDeviceDialog.vue";

export default defineComponent({
  name: "StationsPage",
  components: {
    AddNewDeviceDialog,
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
      deviceDialog: false,
      aDevices: {
        deviceId: "",
        stationId: "",
        description: "",
        routeId: "",
        adId: "",
      },
    };
  },
  created() {
    this.getQrStations();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      qrStations: "qrTrans/qrStations",
    }),
  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/routes")
        : this.$router.push("/");
    },
    async getQrStations() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const routesList = await this.$store.dispatch(
        "qrTrans/getQrStations",
        data
      );
      this.loading = false;
      console.log("app routes: ", routesList);
    },
    addDevice(d) {
      this.deviceDialog = true;
      this.formTitle = "ADD DEVICE";
      this.sId = d._id;
      this.rId = d.route;
      this.aDevices = {
        deviceId: "",
        stationId: "",
        description: "",
        routeId: "",
      };
    },
    openEditDevice(d) {
      console.log("id: ", appRoute._id);
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
    closeAddNewDeviceDialog() {
      this.deviceDialog = false;
    },
  },
});

const columns = [
  {
    name: "NAME",
    align: "left",
    label: "NAME",
    field: "name",
    sortable: true,
  },
  {
    name: "LABEL",
    align: "left",
    label: "LABEL",
    field: "label",
    sortable: true,
  },
  {
    name: "KILOMETERS",
    align: "left",
    label: "KILOMETERS",
    field: "kilometer",
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
