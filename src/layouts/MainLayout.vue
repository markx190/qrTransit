<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          <img
            src="http://159.138.135.212/qrImages/qrl_small.png"
            style="width: 120px; height: 43px; margin-top: 12px"
          />
        </q-toolbar-title>

        LOGGED USER:
        <q-avatar color="amber" class="text-uppercase q-ml-sm">{{
          Array.from(currentUser)[0]
        }}</q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list v-if="currentUserRole !== 'COASTGUARD'">
        <q-item-label header>
          <img
            src="http://159.138.135.212/qrImages/ICON.png"
            style="width: 90px; height: 90px; margin-left: 82px"
          />
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-icon
          v-if="loggedUsers"
          class="q-ml-md logout-icon"
          size="24px"
          name="logout"
          @click="logOut"
        ></q-icon>
        <a
          v-if="loggedUsers"
          @click="logOut"
          href=""
          class="q-pa-lg text-uppercase logout-label"
          >Logout</a
        >
      </q-list>
      <q-item-label header v-if="currentUserRole === 'COASTGUARD'">
        <img
          src="http://159.138.135.212/qrImages/ICON.png"
          style="width: 90px; height: 90px; margin-left: 82px"
        />
      </q-item-label>
      <q-list v-if="currentUserRole === 'COASTGUARD'">
        <CoastGuardLink
          v-for="link in coastGuardLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-icon
          v-if="loggedUsers"
          class="q-ml-md logout-icon"
          size="24px"
          name="logout"
          @click="logOut"
        ></q-icon>
        <a
          v-if="loggedUsers"
          @click="logOut"
          href=""
          class="q-pa-lg text-uppercase logout-label"
          >Logout</a
        >
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import CoastGuardLink from "components/CoastGuardLink.vue";
import { mapGetters } from "vuex";

const linksList = [
  {
    title: "DASHBOARD",
    caption: "Dashboard",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    title: "USERS",
    caption: "List of App Users",
    icon: "group",
    to: "/users",
  },
  {
    title: "ROUTES",
    caption: "List of Routes",
    icon: "route",
    to: "/routes",
  },
  {
    title: "DEVICES",
    caption: "List of Devices",
    icon: "devices",
    to: "/devices",
  },
  {
    title: "VEHICLES",
    caption: "List of Vehicles",
    icon: "local_shipping",
    to: "/vehicles",
  },
  {
    title: "STATIONS",
    caption: "List of Stations",
    icon: "location_city",
    to: "/stations",
  },
  {
    title: "SALES",
    caption: "List of Sales",
    icon: "point_of_sale",
    to: "/sales",
  },
  {
    title: "MANIFEST",
    caption: "Data",
    icon: "support_agent",
    to: "/manifest",
  },
];

const manifestList = [
  {
    title: "DASHBOARD",
    caption: "Dashboard",
    icon: "dashboard",
    to: "/dashboard",
  },
  {
    title: "MANIFEST",
    caption: "Data",
    icon: "support_agent",
    to: "/manifest",
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
    CoastGuardLink,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    return {
      essentialLinks: linksList,
      coastGuardLinks: manifestList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      currentUser: "",
      currentUserRole: "",
      searchUsers: "",
    };
  },
  created() {
    this.checkIsLogged();
  },
  computed: {
    ...mapGetters({
      loggedUsers: "qrTrans/loggedUsers",
      users: "qrTrans/users",
    }),
  },
  methods: {
    async logOut() {
      return await this.$store.dispatch("qrTrans/logOut");
    },
    checkIsLogged() {
      console.log("u: ", this.loggedUsers);
      this.currentUser = this.loggedUsers.user.name;
      this.currentUserRole = this.loggedUsers.user.role;
      this.loggedUsers.token
        ? this.$router.push("/dashboard")
        : this.$router.push("/");
    },
  },
});
</script>
<style>
.logout-label {
  margin-left: 6px;
}
</style>
