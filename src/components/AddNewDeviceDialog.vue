<template>
  <q-dialog v-if="dModal" :model-value="true">
    <q-card style="width: 1350px; max-width: 80vw">
      <q-card-section>
        <div class="text-subtitle2 text-uppercase">
          <q-banner
            inline-actions
            class="bg-grey-2 text-black text-weight-bold"
          >
            <q-icon size="md" name="add_circle_outline" />
            {{ fTitle }}
          </q-banner>
          <q-banner
            v-if="submitAlert"
            inline-actions
            rounded
            class="bg-green-3 text-white q-mt-sm"
          >
            <q-spinner-hourglass color="primary" size="2em" />
            {{ saveDeviceMsg }}
          </q-banner>
        </div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 1350px">
        <q-form @submit="submitDeviceForm" class="q-gutter-md" ref="form">
          <div class="container">
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="fTitle !== 'DELETE DEVICE'"
            >
              <!-- <div class="col-md-3 q-mr-sm">
                <label>STATION</label>
                <q-select
                  filled
                  v-model="model"
                  :options="qrStations"
                  label="Standard"
                  color="teal"
                  clearable
                  options-selected-class="text-deep-orange"
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon name="location_city" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.label
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div> -->
              <div class="col-md-3 q-mr-sm">
                <label>DEVICE ID NO</label>
                <q-input
                  outlined
                  v-model="aDevices.deviceId"
                  hint="DEVICE ID"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div v-if="fTitle === 'EDIT DEVICE'" class="col-md-3 q-mr-sm">
                <label>STATUS</label>
                <q-select
                  outlined
                  v-model="aDevices.status"
                  :options="dStatus"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>DESCRIPTION</label>
                <q-input
                  outlined
                  v-model="aDevices.description"
                  hint="DESCRIPTION"
                />
              </div>
            </div>
            <q-card-section v-else class="q-pt-none text-weight-bold">
              Are you sure you want to delete this Device?
            </q-card-section>
          </div>

          <div>
            <q-btn
              v-if="fTitle === 'Delete Device'"
              label="Delete"
              type="submit"
              color="red"
            />
            <q-btn v-else label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
      <!-- <div class="row rounded-borders">
        <div class="col-md-12 q-pa-md" style="max-width: 1850px">
          <q-table
            :rows="qrDevicesByStationId"
            :columns="colDevices"
            :filter="filter"
            :loading="loading"
            row-key="name"
          >
          </q-table>
        </div>
      </div> -->
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
  name: "AddNewDeviceDialog",
  props: ["dModal", "routeId", "devicesData", "stationId", "fTitle"],
  setup() {
    const loading = ref(true);
    const filter = ref("");
    return {
      colDevices,
      // loading,
      filter,
    };
  },
  data() {
    return {
      submitAlert: false,
      saveDeviceMsg: "",
      aDevices: {
        _id: "",
        deviceId: "",
        stationId: "",
        status: "",
        description: "",
        routeId: "",
      },
      dStatus: ["ACTIVATE", "DEACTIVATE"],
    };
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      qrStationsId: "qrTrans/qrStationsId",
      qrDevices: "qrTrans/qrDevices",
      qrDevicesByStationId: "qrTrans/qrDevicesByStationId",
      qrStations: "qrTrans/qrStations",
    }),
  },
  watch: {
    stationId: {
      handler(val) {
        if (val) {
          this.getQrDevicesByStationId();
        } else {
          null;
        }
      },
      immediate: true,
    },
    devicesData: {
      handler(val) {
        if (val) {
          this.aDevices._id = val._id;
          this.aDevices.deviceId = val.deviceId;
          this.aDevices.status = val.status;
          this.aDevices.description = val.description;
        } else {
          this.aDevices._id = "";
          this.aDevices.deviceId = "";
          this.aDevices.status = "";
          this.aDevices.description = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
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
    async getQrStations() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const sts = await this.$store.dispatch("qrTrans/getQrStations", data);
      this.loading = false;
      console.log("x1: ", sts);
    },
    async getQrDevicesByStationId() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };

      const routesList = await this.$store.dispatch(
        "qrTrans/getQrDevicesByStationId",
        this.stationId,
        auth
      );
      this.loading = false;
      console.log("X Devices: ", routesList);
    },
    async saveDevice() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        deviceId: this.aDevices.deviceId,
        stationId: this.stationId,
        description: this.aDevices.description,
        routeId: this.routeId === "" ? "R1" : this.routeId,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/createDevices",
        data,
        auth
      );
      this.saveDeviceMsg = "DEVICE WAS ADDED SUCCESSFULLY";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.$router.push("/devices");
        }, 3000);
    },
    async saveUpdatedDevice() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        _id: this.aDevices._id,
        deviceId: this.aDevices.deviceId,
        stationId: this.aDevices.stationId,
        status: this.aDevices.status,
        routeId: this.aDevices.routeId,
        description: this.aDevices.description,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/updateDevices",
        data,
        auth
      );
      this.saveDeviceMsg = "DEVICE WAS SUCCESSFULLY UPDATED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getQrDevices();
        }, 3000);
    },
    async deleteDevice() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;

      let data = {
        _id: this.aDevices._id,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/deleteDevices",
        data,
        auth
      );
      this.saveDeviceMsg = "DEVICE WAS DELETED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getQrDevices();
        }, 3000);
    },
    submitDeviceForm() {
      this.fTitle === "ADD DEVICE"
        ? this.saveDevice()
        : this.fTitle === "EDIT DEVICE"
        ? this.saveUpdatedDevice()
        : this.deleteDevice();
    },
  },
});

const colDevices = [
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
    name: "actions",
    align: "center",
    label: "ACTION",
    field: "actions",
    sortable: false,
  },
];
</script>
