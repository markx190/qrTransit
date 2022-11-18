<template>
  <q-dialog v-if="vModal" :model-value="true">
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
            {{ updateVehiclesMsg }}
          </q-banner>
        </div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 1350px">
        <q-form @submit="submitForm" class="q-gutter-md" ref="form">
          <div class="container">
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="fTitle !== 'Delete Vehicle'"
            >
              <div class="col-md-3 q-mr-sm">
                <label>VEHICLEID</label>
                <q-input
                  outlined
                  v-model="aVehicles.vehicleId"
                  hint="VEHICLE ID"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>TYPE</label>
                <q-input
                  outlined
                  v-model="aVehicles.type"
                  hint="TYPE"
                  lazy-rules
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>PASSENGER LIMIT</label>
                <q-input
                  outlined
                  v-model="aVehicles.passengerLimit"
                  hint="PASSENGER LIMIT"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
            </div>
            <q-card-section v-else class="q-pt-none text-weight-bold">
              Are you sure you want to delete this Vehicle?
            </q-card-section>
          </div>

          <div>
            <q-btn
              v-if="fTitle === 'Delete Vehicle'"
              label="Delete"
              type="submit"
              color="red"
            />
            <q-btn v-else label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="Close" @click="close" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "AddNewVehiclesDialog",
  props: ["vehicleData", "vModal", "fTitle"],
  data() {
    return {
      submitAlert: false,
      updateVehiclesMsg: "",
      aVehicles: {
        id: "",
        vehicleId: "",
        type: "",
        passengerLimit: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  watch: {
    vehicleData: {
      handler(val) {
        if (val) {
          this.aVehicles.id = val.id;
          this.aVehicles.vehicleId = val.vehicleId;
          this.aVehicles.type = val.type;
          this.aVehicles.passengerLimit = val.passengerLimit;
        } else {
          this.aVehicles.id = "";
          this.aVehicles.vehicleId = "";
          this.aVehicles.type = "";
          this.aVehicles.from = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async getAppVehicles() {
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const vehicleList = await this.$store.dispatch(
        "qrTrans/getQrVehicles",
        data
      );
    },
    async saveVehicles() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        vehicleId: this.aVehicles.vehicleId,
        type: this.aVehicles.type,
        passengerLimit: this.aVehicles.passengerLimit,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/createVehicles",
        data,
        auth
      );
      this.updateVehiclesMsg = "VEHICLE WAS ADDED SUCCESSFULLY";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppVehicles();
        }, 6000);
    },
    async saveUpdatedVehicles() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        id: this.aVehicles.id,
        vehicleId: this.aVehicles.vehicleId,
        type: this.aVehicles.type,
        passengerLimit: this.aVehicles.passengerLimit,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/updateVehicles",
        data,
        auth
      );
      this.updateVehiclesMsg = "VEHICLE WAS SUCCESSFULLY UPDATED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppVehicles();
        }, 3000);
    },
    async deleteVehicles() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;

      let data = {
        id: this.aVehicles.id,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/deleteVehicles",
        data,
        auth
      );
      this.updateVehiclesMsg = "VEHICLE WAS DELETED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppVehicles();
        }, 3000);
    },
    submitForm() {
      this.fTitle === "Add Vehicle"
        ? this.saveVehicles()
        : this.fTitle === "Edit Vehicle"
        ? this.saveUpdatedVehicles()
        : this.deleteVehicles();
    },
  },
});
</script>
