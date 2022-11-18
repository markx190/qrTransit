<template>
  <q-page>
    <div class="q-pa-md">
      <q-btn
        class="glossy"
        unelevated
        rounded
        label="Add Vehicle"
        color="green"
        icon="camera_enhance"
        @click="openAddVehicles()"
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
      <AddNewVehiclesDialog
        :vModal="vehicleDialog"
        :vehicleData="aVehicles"
        :fTitle="formTitle"
        @close="closeVehicleDialog"
        @hide="closeVehicleDialog"
      />
      <q-table
        title="VEHICLES"
        :rows="qrVehicles"
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
              color="primary"
              @click="openEditVehicles(props.row)"
              class="q-mr-sm"
            />
            <q-btn
              round
              icon="delete"
              color="red"
              @click="openDeleteVehicles(props.row)"
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
import AddNewVehiclesDialog from "components/AddNewVehiclesDialog.vue";

export default defineComponent({
  name: "VehiclesPage",
  components: {
    AddNewVehiclesDialog,
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
      vehicleDialog: false,
      aVehicles: {
        vehicleId: "",
        type: "",
        passengerLimit: "",
      },
    };
  },
  created() {
    this.getVehicles();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      qrVehicles: "qrTrans/qrVehicles",
    }),
  },
  methods: {
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/vehicles")
        : this.$router.push("/");
    },
    async getVehicles() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const vehicleList = await this.$store.dispatch(
        "qrTrans/getQrVehicles",
        data
      );
      this.loading = false;
      console.log("app vehicles: ", vehicleList);
    },
    openAddVehicles() {
      this.vehicleDialog = true;
      this.formTitle = "Add Vehicle";
      this.aVehicles = {
        vehicleId: "",
        type: "",
        passengerLimit: "",
      };
    },
    openEditVehicles(appVehicle) {
      console.log("v: ", appVehicle);
      this.vehicleDialog = true;
      this.formTitle = "Edit Vehicle";
      this.aVehicles = {
        id: appVehicle._id,
        vehicleId: appVehicle.vehicleId,
        type: appVehicle.type,
        passengerLimit: appVehicle.passengerLimit,
      };
    },
    openDeleteVehicles(appVehicle) {
      this.vehicleDialog = true;
      this.formTitle = "Delete Vehicle";
      this.aVehicles = {
        id: appVehicle._id,
      };
    },
    closeVehicleDialog() {
      this.vehicleDialog = false;
    },
  },
});

const columns = [
  {
    name: "vehicleId",
    align: "left",
    label: "ID",
    field: "vehicleId",
    sortable: true,
  },
  {
    name: "type",
    align: "left",
    label: "TYPE",
    field: "type",
    sortable: true,
  },
  {
    name: "passengerLimit",
    align: "left",
    label: "PASSENGER LIMIT",
    field: "passengerLimit",
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
