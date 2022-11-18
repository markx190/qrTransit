<template>
  <q-space class="q-mb-md" />
  <div class="row q-ml-md">
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-green text-white">
          <!-- <q-icon name="group" size="lg" style="margin-left: -105px" /> -->
          <img
            src="http://159.138.135.212/qrImages/USERS.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalUsers }}</div>
          <div class="text-caption">
            <router-link to="/users" class="text-white">USERS</router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2 q-ml-md">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-accent text-white">
          <img
            src="http://159.138.135.212/qrImages/STATIONS.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalStations }}</div>
          <div class="text-caption">
            <router-link to="/stations" class="text-white"
              >STATIONS</router-link
            >
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2 q-ml-lg">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-orange text-white">
          <img
            src="http://159.138.135.212/qrImages/ROUTES.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalRoutes }}</div>
          <div class="text-caption">
            <router-link to="/routes" class="text-white">ROUTES</router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2 q-ml-lg">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-grey text-white">
          <img
            src="http://159.138.135.212/qrImages/ROUTES.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalDevices }}</div>
          <div class="text-caption">
            <router-link to="/devices" class="text-white">DEVICES</router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2 q-ml-lg">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-pink-12 text-white">
          <img
            src="http://159.138.135.212/qrImages/VEHICLES.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalVehicles }}</div>
          <div class="text-caption">
            <router-link to="/vehicles" class="text-white"
              >VEHICLES</router-link
            >
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div class="row q-mt-sm">
    <div v-if="currentUserRole !== 'COASTGUARD'" class="col-md-2 q-ml-md">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-red text-white">
          <img
            src="http://159.138.135.212/qrImages/SALES.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalSales }}</div>
          <div class="text-caption">
            <router-link to="/sales" class="text-white">SALES</router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-md-2 q-ml-md">
      <q-card class="my-card text-center" size="150">
        <q-card-section class="bg-brown text-white">
          <img
            src="http://159.138.135.212/qrImages/MANIFEST.png"
            style="width: 40px; height: 40px; margin-left: -90px"
          />
          <div class="text-h6">{{ totalSales }}</div>
          <div class="text-caption">
            <router-link to="/manifest" class="text-white"
              >MANIFEST</router-link
            >
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "IndexPage",
  data() {
    return {
      currentUserRole: "",
      totalUsers: "",
      totalRoutes: "",
      totalDevices: "",
      totalVehicles: "",
      totalSales: "",
      totalStations: "",
      appUsers: [],
    };
  },
  mounted() {
    this.checkIsLogged();
  },
  created() {
    this.getTotalUsers();
    this.getTotalRoutes();
    this.getTotalDevices();
    this.getTotalVehicles();
    this.getTotalSales();
    this.getTotalStations();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      qrRoutes: "qrTrans/qrRoutes",
      qrDevices: "qrTrans/qrDevices",
      qrVehicles: "qrTrans/qrVehicles",
      qrSales: "qrTrans/qrSales",
      qrStations: "qrTrans/qrStations",
      loggedUsers: "qrTrans/loggedUsers",
    }),
  },
  methods: {
    async getTotalUsers() {
      const token = this.loggedUsers.token;
      const user = this.loggedUsers.user.email;

      console.log("token: ", token);
      console.log("user: ", user);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const usersList = await this.$store.dispatch("qrTrans/getUsers", data);
      this.totalUsers = this.users.length;
    },
    async getTotalRoutes() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const usersList = await this.$store.dispatch("qrTrans/getQrRoutes", data);
      this.totalRoutes = this.qrRoutes.length;
    },
    async getTotalDevices() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const sales = await this.$store.dispatch("qrTrans/getQrDevices", data);
      this.totalDevices = this.qrDevices.length;
    },
    async getTotalVehicles() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const sales = await this.$store.dispatch("qrTrans/getQrVehicles", data);
      this.totalVehicles = this.qrVehicles.length;
    },
    async getTotalSales() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const sales = await this.$store.dispatch("qrTrans/getQrSales", data);
      this.totalSales = this.qrSales.length;
    },
    async getTotalStations() {
      const token = this.loggedUsers.token;
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const stations = await this.$store.dispatch(
        "qrTrans/getQrStations",
        data
      );
      this.totalStations = this.qrStations.length;
    },
    checkIsLogged() {
      this.currentUserRole = this.loggedUsers.user.role;
      this.loggedUsers.token
        ? this.$router.push("/dashboard")
        : this.$router.push("/");
    },
  },
});
</script>
<style>
.user-label {
  margin-top: 30px;
}
</style>
