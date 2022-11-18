<template>
  <AddNewUsersDialog
    :fModal="medium"
    :qrData="aUsers"
    :title="formTitle"
    @close="closeDialog"
    @hide="closeDialog"
  />
  <q-form @submit="submitFilter" class="q-gutter-md" ref="form">
    <q-input
      class="q-pa-sm"
      rounded
      outlined
      v-model="search.filterUsers"
      label="Search User"
      @keyup="submitFilter()"
      dense
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </q-form>
  <q-btn
    class="glossy q-ml-md q-mt-sm"
    unelevated
    rounded
    color="green"
    icon="person_add_alt"
    label="ADD USER"
    @click="openAddUsers()"
  />

  <div class="row flex-row">
    <div
      class="q-pa-md"
      v-for="appUser in paginateUsers"
      :key="appUser"
      style="max-width: 350px"
    >
      <q-toolbar class="bg-accent text-white shadow-2">
        <q-toolbar-title class="text-caption text-uppercase">{{
          appUser.name
        }}</q-toolbar-title>
      </q-toolbar>

      <q-list bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar color="amber">{{ Array.from(appUser.name)[0] }}</q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label caption lines="1"
              >NAME: {{ appUser.name }}</q-item-label
            >
            <q-item-label caption lines="1"
              >EMAIL: {{ appUser.email }}</q-item-label
            >
            <q-item-label caption lines="1"
              >ROLE: {{ appUser.role }}</q-item-label
            >
            <q-item-label caption lines="1"
              >STATUS: {{ appUser.status }}</q-item-label
            >
            <q-item-label caption lines="1"
              ><q-btn
                class="glossy q-ml-lg"
                unelevated
                size="sm"
                color="green"
                label="UPDATE"
                @click="openEditUsers(appUser)" />
              <q-btn
                v-if="appUser.status === 'Deactivated'"
                class="glossy q-ml-lg"
                unelevated
                size="sm"
                color="primary"
                label="Activate"
                @click="changeStatus(appUser)" />
              <q-btn
                v-else
                class="glossy q-ml-lg"
                unelevated
                size="sm"
                color="red"
                label="Deactivate"
                @click="changeStatus(appUser)"
            /></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

  <div v-if="appUsers.length >= 5" class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="page"
      :min="currentPage"
      :max="Math.ceil(appUsers.length / totalPages)"
      :input="true"
      input-class="text-orange-10"
      size="2em"
    />
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { mapGetters } from "vuex";
import AddNewUsersDialog from "components/AddNewUsersDialog.vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "IndexPage",
  components: {
    AddNewUsersDialog,
  },
  setup() {
    const $q = useQuasar();
    return {
      isPwd: ref(true),
      triggerPositive() {
        $q.notify({
          type: "positive",
          message: "User Status was Updated",
        });
      },
    };
  },
  data() {
    return {
      isSet: false,
      isFilter: false,
      medium: false,
      formTitle: "",
      page: 1,
      currentPage: 1,
      nextPage: null,
      totalPages: 6,
      search: {
        filterUsers: "",
      },
      aUsers: {
        id: "",
        name: "",
        email: "",
        password: "",
        role: "",
        status: "",
      },
      appUsers: [],
    };
  },
  created() {
    this.checkIsLogged();
  },
  mounted() {
    this.getAppUsers();
  },
  computed: {
    ...mapGetters({
      users: "qrTrans/users",
      loggedUsers: "qrTrans/loggedUsers",
      searchedUsers: "qrTrans/searchedUsers",
    }),
    paginateUsers() {
      return this.appUsers.slice(
        (this.page - 1) * this.totalPages,
        (this.page - 1) * this.totalPages + this.totalPages
      );
    },
  },
  methods: {
    async getAppUsers() {
      this.isSet = true;
      const token = this.loggedUsers.token;
      console.log("token: ", token);
      let data = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const usersList = await this.$store.dispatch("qrTrans/getUsers", data);
      this.appUsers = this.users;
      console.log("app users: ", this.appUsers);
    },
    checkIsLogged() {
      this.loggedUsers.token
        ? this.$router.push("/users")
        : this.$router.push("/");
    },
    openAddUsers() {
      this.medium = true;
      this.formTitle = "Add User";
      this.aUsers = {
        name: "",
        email: "",
        password: "",
        role: "",
      };
    },
    openEditUsers(appUser) {
      console.log("id: ", appUser._id);
      this.medium = true;
      this.formTitle = "Edit User";
      this.aUsers = {
        id: appUser._id,
        name: appUser.name,
        email: appUser.email,
        role: appUser.role,
        status: appUser.status,
      };
    },
    closeDialog() {
      this.medium = false;
    },
    async submitFilter() {
      let data = {
        params: this.search.filterUsers,
      };
      data.length <= 0 ? (this.appUsers = this.users) : null;
      const result = await this.$store.dispatch("qrTrans/searchUsers", data);
      return (this.appUsers = this.users);
      console.log("u: ", this.searchedUsers);
    },
    async changeStatus(appUser) {
      const token = this.loggedUsers.token;
      let data = {
        id: appUser._id,
        status: appUser.status === "Active" ? "Deactivated" : "Active",
      };
      let auth = {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      };
      const result = await this.$store.dispatch(
        "qrTrans/changeUserStatus",
        data,
        auth
      );
      this.triggerPositive();
      this.getAppUsers();
    },
  },
});
</script>
