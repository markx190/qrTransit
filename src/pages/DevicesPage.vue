<template>
  <q-page>
    <div class="q-pa-md">
      <!-- <q-btn
        class="glossy"
        unelevated
        rounded
        label="Add Device"
        color="green"
        icon="camera_enhance"
        @click="openAddDevices()"
      /> -->
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
      <AddNewDevicesDialog
        :dModal="devicesDialog"
        :devicesData="aDevices"
        :fTitle="formTitle"
        @close="closeDevicesDialog"
        @hide="closeDevicesDialog"
      />
      <q-table
        title="DEVICES"
        :rows="qrDevices"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        row-key="title"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              round
              icon="mode_edit"
              alt="Edit"
              color="primary"
              @click="openEditDevices(props.row)"
              class="q-mr-sm"
            />
            <!-- <q-btn
              round
              icon="delete"
              color="red"
              @click="openDeleteDevices(props.row)"
            /> -->
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
import AddNewDevicesDialog from "src/components/AddNewDeviceDialog.vue";

export default defineComponent({
  name: "DevicePage",
  components: {
    AddNewDevicesDialog,
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
      devicesDialog: false,
      stationDialog: false,
      dStations: [],
      aDevices: {
        _id: 0,
        deviceId: "",
        stationId: [],
        description: "",
        routeId: [],
      },
    };
  },
  created() {
    this.getQrDevices();
  },
  computed: {
    ...mapGetters({
      loggedUsers: "qrTrans/loggedUsers",
      qrStationsId: "qrTrans/qrStationsId",
      qrDevices: "qrTrans/qrDevices",
    }),
  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/devices")
        : this.$router.push("/");
    },
    // async getStations() {
    //   const token = this.loggedUsers.token;
    //   let data = {
    //     headers: {
    //       Authorization: `Bearer: ${token}`,
    //     },
    //   };
    //   const stationsList = await this.$store.dispatch(
    //     "qrTrans/getQrStationsId",
    //     data
    //   );
    //   this.loading = false;
    //   console.log("app stations: ", stationsList);
    // },
    async getQrDevices() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const devicesList = await this.$store.dispatch(
        "qrTrans/getQrDevices",
        data
      );
      this.loading = false;
      console.log("app devices: ", devicesList);
    },
    openAddDevices() {
      this.devicesDialog = true;
      this.formTitle = "ADD DEVICE";
      this.aDevices = {
        _id: 0,
        deviceId: "",
        stationId: "",
        description: "",
        routeId: "",
      };
    },
    openEditDevices(dev) {
      console.log("id: ", dev);
      this.devicesDialog = true;
      this.formTitle = "EDIT DEVICE";
      this.aDevices = {
        _id: dev._id,
        deviceId: dev.deviceId,
        stationId: dev.station._id,
        routeId: dev.station.route,
        status: dev.status,
        description: dev.description,
      };
    },
    openDeleteDevices(dev) {
      this.devicesDialog = true;
      this.formTitle = "DELETE DEVICE";
      this.aRoutes = {
        _id: dev._id,
      };
    },
    closeDevicesDialog() {
      this.devicesDialog = false;
    },
  },
});

const columns = [
  {
    name: "deviceId",
    align: "left",
    label: "DEVICE ID",
    field: "deviceId",
    sortable: true,
  },
  {
    name: "description",
    align: "left",
    label: "DESCRIPTION",
    field: "description",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "STATUS",
    field: "status",
    sortable: true,
  },
  {
    name: "station",
    align: "left",
    label: "STATION",
    field: "station",
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
