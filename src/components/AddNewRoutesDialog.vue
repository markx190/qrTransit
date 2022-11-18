<template>
  <q-dialog v-if="rModal" :model-value="true">
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
            {{ updateUserMsg }}
          </q-banner>
        </div>
      </q-card-section>
      <div class="q-pa-md" style="max-width: 1350px">
        <q-form @submit="submitForm" class="q-gutter-md" ref="form">
          <div class="container">
            <div
              class="row bg-grey-2 q-pa-sm rounded-borders"
              v-if="fTitle !== 'Delete Route'"
            >
              <div class="col-md-3 q-mr-sm">
                <label>DIRECTION</label>
                <q-select
                  outlined
                  v-model="aRoutes.direction"
                  :options="options"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>FROM</label>
                <q-input
                  outlined
                  v-model="aRoutes.from"
                  hint="FROM"
                  lazy-rules
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>TO</label>
                <q-input
                  outlined
                  v-model="aRoutes.to"
                  hint="TO"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>BASEFARE</label>
                <q-input
                  outlined
                  v-model="aRoutes.baseFare"
                  hint="BASEFARE"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
              <div class="col-md-3 q-mr-sm">
                <label>PER KM. FARE</label>
                <q-input
                  outlined
                  v-model="aRoutes.perKmFare"
                  hint="PER KM FARE"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'This is required',
                  ]"
                />
              </div>
            </div>
            <q-card-section v-else class="q-pt-none text-weight-bold">
              Are you sure you want to delete this Route?
            </q-card-section>
          </div>

          <div>
            <q-btn
              v-if="fTitle === 'Delete Route'"
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
  name: "AddNewRoutesDialog",
  props: ["routeData", "rModal", "fTitle"],
  data() {
    return {
      submitAlert: false,
      updateUserMsg: "",
      aRoutes: {
        _id: "",
        direction: "",
        from: "",
        to: "",
        baseFare: "",
        perKmFare: "",
      },
      options: ["NORTBOUND", "SOUTHBOUND"],
    };
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  watch: {
    routeData: {
      handler(val) {
        if (val) {
          this.aRoutes._id = val._id;
          this.aRoutes.direction = val.direction;
          this.aRoutes.from = val.from;
          this.aRoutes.to = val.to;
          this.aRoutes.baseFare = val.baseFare;
          this.aRoutes.perKmFare = val.perKmFare;
        } else {
          this.aRoutes._id = "";
          this.aRoutes.direction = "";
          this.aRoutes.from = "";
          this.aRoutes.to = "";
          this.aRoutes.baseFare = "";
          this.aRoutes.perKmFare = "";
        }
      },
      immediate: true,
    },
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
      const routeList = await this.$store.dispatch("qrTrans/getQrRoutes", data);
    },
    async saveRoutes() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        direction: this.aRoutes.direction,
        from: this.aRoutes.from,
        to: this.aRoutes.to,
        baseFare: this.aRoutes.baseFare,
        perKmFare: this.aRoutes.perKmFare,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/createRoutes",
        data,
        auth
      );
      this.updateUserMsg = "ROUTE WAS ADDED SUCCESSFULLY";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppRoutes();
        }, 6000);
    },
    async saveUpdatedRoutes() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;
      let data = {
        _id: this.aRoutes._id,
        direction: this.aRoutes.direction,
        from: this.aRoutes.from,
        to: this.aRoutes.to,
        baseFare: this.aRoutes.baseFare,
        perKmFare: this.aRoutes.perKmFare,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/updateRoutes",
        data,
        auth
      );
      this.updateUserMsg = "ROUTE WAS SUCCESSFULLY UPDATED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppRoutes();
        }, 3000);
    },
    async deleteRoutes() {
      const token = this.loggedUsers.token;
      const uEmail = this.loggedUsers.user.email;

      let data = {
        _id: this.aRoutes._id,
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
        email: uEmail,
      };
      const result = await this.$store.dispatch(
        "qrTrans/deleteRoutes",
        data,
        auth
      );
      this.updateUserMsg = "ROUTE WAS DELETED";
      (this.submitAlert = true),
        setTimeout(() => {
          this.submitAlert = false;
          this.close();
          this.getAppRoutes();
        }, 3000);
    },
    submitForm() {
      this.fTitle === "Add Route"
        ? this.saveRoutes()
        : this.fTitle === "Edit Route"
        ? this.saveUpdatedRoutes()
        : this.deleteRoutes();
    },
  },
});
</script>
